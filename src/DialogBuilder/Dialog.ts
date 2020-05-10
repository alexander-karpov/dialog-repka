import { ReplyBuilder } from './ReplyBuilder';
import { JustReplyBuilder } from './JustReplyBuilder';
import { SessionState } from './SessionState';
import { Screen } from './Screen';
import { DialogRequest } from './DialogRequest';
import { DialogResponse } from './DialogResponse';
import { DialogIntent } from './DialogIntent';
import { InputData } from './InputData';
// TODO: Терминальная цвена не должна быть без представления

/**
 * @param TState Состояние будет доступно в методах определения сцены
 * @param TScreenId Можно указать список возможных сцен чтобы исключить случайную ошибку при их определении
 */
export class Dialog<TState, TScreenId = string> {
    constructor(
        private readonly screens: Map<TScreenId, Screen<TState, TScreenId>>,
        private readonly initialScreen: TScreenId,
        private readonly initialState: TState
    ) {}

    handleRequest(request: DialogRequest): DialogResponse {
        if (this.isPingRequest(request)) {
            return this.handlePingRequest();
        }

        return this.handleUserRequest(request);
    }

    private isPingRequest(request: DialogRequest) {
        return request.request.original_utterance.includes('ping');
    }

    private handlePingRequest(): DialogResponse {
        return {
            response: { text: 'pong', end_session: true },
            version: '1.0',
        };
    }

    private handleUserRequest(request: DialogRequest): DialogResponse {
        const {
            command,
            nlu: { intents },
        } = request.request;

        const inputData: InputData = { command, intents, request };
        const sessionState = request.state && request.state.session;

        const context: SessionState<TState, TScreenId> = this.isNotEmptySessionState(sessionState)
            ? sessionState
            : this.createInitialContext();

        const output = new JustReplyBuilder();

        const screen = this.getScreen(context.$currentScreen);

        if (intents) {
            /**
             * Обработка запроса «Помощь» и подобных
             */
            if (
                inputData.intents[DialogIntent.Help] ||
                inputData.intents[DialogIntent.WhatCanYouDo]
            ) {
                screen.appendHelp(output, context.state);
                return output.build(context);
            }

            /**
             * Обработка запроса «Повтори» и подобных
             */
            if (inputData.intents[DialogIntent.Repeat]) {
                screen.appendReply(output, context.state);
                return output.build(context);
            }
        }

        const { state: stateAfterInput, $currentScreen: sceneAfterInput } = screen.applyInput(
            inputData,
            context.state
        );

        /**
         * Обработка нераспознанного запроса, когда Input возвращает undefined
         */
        if (!sceneAfterInput) {
            screen.appendUnrecognized(output, context.state);
            return output.build({ state: stateAfterInput, $currentScreen: context.$currentScreen });
        }

        const contextAfterScreens = this.goThroughScreens(
            { state: stateAfterInput, $currentScreen: sceneAfterInput },
            output
        );

        return output.build(contextAfterScreens);
    }

    private goThroughScreens(
        context: SessionState<TState, TScreenId>,
        output: ReplyBuilder
    ): SessionState<TState, TScreenId> {
        const screen = this.getScreen(context.$currentScreen);

        screen.appendReply(output, context.state);
        const contextAfterTransition = screen.applyTransition(context.state);

        if (
            contextAfterTransition.state !== context.state &&
            contextAfterTransition.$currentScreen !== context.$currentScreen
        ) {
            return this.goThroughScreens(contextAfterTransition, output);
        }

        return context;
    }

    private getScreen(ScreenId: TScreenId): Screen<TState, TScreenId> {
        const screen = this.screens.get(ScreenId);

        if (!screen) {
            throw new Error(`Сцена ${ScreenId} не существует.`);
        }

        return screen;
    }

    private createInitialContext(): SessionState<TState, TScreenId> {
        return {
            state: this.initialState,
            $currentScreen: this.initialScreen,
        };
    }

    private isNotEmptySessionState(
        sessionState: SessionState<TState, TScreenId> | {}
    ): sessionState is SessionState<TState, TScreenId> {
        return sessionState && '$currentScreen' in sessionState && 'state' in sessionState;
    }
}
