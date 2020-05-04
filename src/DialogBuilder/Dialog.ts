import { ReplyBuilder } from './ReplyBuilder';
import { JustReplyBuilder } from './JustReplyBuilder';
import { DialogContext } from './DialogContext';
import { Screen } from './Screen';
import { DialogRequest } from './DialogRequest';
import { DialogResponse } from './DialogResponse';
import { DialogIntent } from './DialogIntent';
import { RequestData } from './RequestData';
// TODO: Терминальная цвена не должна быть без представления

export type SetState<TState> = (patch: Partial<TState>) => void;

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

    interact(
        request: DialogRequest<DialogContext<TState, TScreenId>>
    ): DialogResponse<DialogContext<TState, TScreenId>> {
        const { command, nlu: { intents } } = request.request;
        const reqData: RequestData = { command, intents };
        const sessionState = request.state.session;

        const context = this.isNotEmptySessionState(sessionState)
            ? sessionState
            : this.createInitialContext();

        const output = new JustReplyBuilder();

        const screen = this.getScreen(context.$currentScreen);

        /**
         * Обработка запроса «Помощь и подобных
         */
        if(reqData.intents[DialogIntent.Help] || reqData.intents[DialogIntent.WhatCanYouDo]) {
            screen.appendHelp(output, context);
            return output.build<DialogContext<TState, TScreenId>>(context);
        }

        const contextAfterInput = screen.applyInput(reqData, context);
        const contextAfterScreens = this.goThroughScreens(contextAfterInput, output);

        contextAfterScreens.$previousScreen = context.$currentScreen;
        return output.build<DialogContext<TState, TScreenId>>(contextAfterScreens);
    }

    private goThroughScreens(
        context: DialogContext<TState, TScreenId>,
        output: ReplyBuilder
    ): DialogContext<TState, TScreenId> {
        const screen = this.getScreen(context.$currentScreen);

        screen.appendReply(output, context);
        const contextAfterTransition = screen.applyTransition(context);

        if (contextAfterTransition !== context) {
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
            ...this.initialState,
            $currentScreen: this.initialScreen,
            $previousScreen: this.initialScreen,
        };
    }

    private isNotEmptySessionState(
        state: DialogContext<TState, TScreenId> | {}
    ): state is DialogContext<TState, TScreenId> {
        return '$currentScreen' in state;
    }
}
