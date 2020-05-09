import { ReplyBuilder } from './ReplyBuilder';
import { JustReplyBuilder } from './JustReplyBuilder';
import { DialogContext } from './DialogContext';
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

    interact(request: DialogRequest): DialogResponse {
        if (request.request.original_utterance.includes('ping')) {
            return {
                response: { text: 'pong', end_session: false },
                version: '1.0',
            };
        }

        const {
            command,
            nlu: { intents },
        } = request.request;

        const reqData: InputData = { command, intents, request };
        const sessionState = request.state && request.state.session;

        const context = this.isNotEmptySessionState(sessionState)
            ? sessionState
            : this.createInitialContext();

        const output = new JustReplyBuilder();

        const screen = this.getScreen(context.$currentScreen);

        if (intents) {
            /**
             * Обработка запроса «Помощь» и подобных
             */
            if (reqData.intents[DialogIntent.Help] || reqData.intents[DialogIntent.WhatCanYouDo]) {
                screen.appendHelp(output, context.state);
                return output.build(context);
            }

            /**
             * Обработка запроса «Повтори» и подобных
             */
            if (reqData.intents[DialogIntent.Repeat]) {
                screen.appendReply(output, context.state);
                return output.build(context);
            }
        }

        const contextAfterInput = screen.applyInput(reqData, context.state);
        const contextAfterScreens = this.goThroughScreens(contextAfterInput, output);

        return output.build(contextAfterScreens);
    }

    private goThroughScreens(
        context: DialogContext<TState, TScreenId>,
        output: ReplyBuilder
    ): DialogContext<TState, TScreenId> {
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

    private createInitialContext(): DialogContext<TState, TScreenId> {
        return {
            state: this.initialState,
            $currentScreen: this.initialScreen,
        };
    }

    private isNotEmptySessionState(
        sessionState: DialogContext<TState, TScreenId> | {}
    ): sessionState is DialogContext<TState, TScreenId> {
        return sessionState && '$currentScreen' in sessionState && 'state' in sessionState;
    }
}
