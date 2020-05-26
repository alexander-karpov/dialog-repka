import { Screen } from './Screen';
import { JustScreenBuilder } from './JustScreenBuilder';
import { Dialog } from './Dialog';
import { ReplyConstructor } from './ReplyConstructor';

export type SetState<TState> = (patch: Partial<TState>) => void;

/**
 * @param TState Состояние будет доступно в методах определения сцены
 * @param TScreenId Можно указать список возможных сцен чтобы исключить случайную ошибку при их определении
 */
export class DialogBuilder<TState, TScreenId = string> {
    private whatCanYouDoHandler?: ReplyConstructor<TState>;

    private readonly screenBuilders: Map<
        TScreenId,
        JustScreenBuilder<TState, TScreenId>
    > = new Map();

    createScreen(ScreenId: TScreenId) {
        if (this.screenBuilders.has(ScreenId)) {
            throw new Error(`Сцена ${ScreenId} уже существует.`);
        }

        const newScreen = new JustScreenBuilder<TState, TScreenId>();
        this.screenBuilders.set(ScreenId, newScreen);

        return newScreen;
    }

    withWhatCanYouDo(whatCanYouDoHandler: ReplyConstructor<TState>): void {
        if (this.whatCanYouDoHandler) {
            throw new Error(
                'Обработчик WhatCanYouDo уже задан. Возможно вы вызвали метод withwhatCanYouDo повторно.'
            );
        }

        this.whatCanYouDoHandler = whatCanYouDoHandler;
    }

    build(initialScreen: TScreenId, initialState: TState): Dialog<TState, TScreenId> {
        const screens = new Map<TScreenId, Screen<TState, TScreenId>>();
        const noop = () => {};

        for (const [screenId, screenBuilder] of this.screenBuilders.entries()) {
            screens.set(screenId, screenBuilder.build(screenId));
        }

        return new Dialog(screens, initialScreen, initialState, this.whatCanYouDoHandler || noop);
    }
}
