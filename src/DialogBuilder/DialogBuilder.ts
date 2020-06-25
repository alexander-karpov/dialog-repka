import { Scene } from './Scene';
import { SceneBuilder } from './SceneBuilder';
import { Dialog } from './Dialog';
import { ReplyHandler } from './ReplyHandler';
import { Transition } from './TransitionScene';
import { TransitionBuilder } from './TransitionBuilder';

export type SetState<TState> = (patch: Partial<TState>) => void;

/**
 * @param TState Состояние будет доступно в методах определения сцены
 * @param TSceneId Можно указать список возможных сцен чтобы исключить случайную ошибку при их определении
 */
export class DialogBuilder<TState, TSceneId = string> {
    private whatCanYouDoHandler?: ReplyHandler<TState>;

    private readonly sceneBuilders: Map<
        TSceneId,
        SceneBuilder<TState, TSceneId>
    > = new Map();

    private readonly transitionSceneBuilders: Map<
        TSceneId,
        TransitionBuilder<TState, TSceneId>
    > = new Map();

    createScene(sceneId: TSceneId) {
        if (this.sceneBuilders.has(sceneId) || this.transitionSceneBuilders.has(sceneId)) {
            throw new Error(`Сцена или переход ${sceneId} уже существует.`);
        }

        const newScene = new SceneBuilder<TState, TSceneId>();
        this.sceneBuilders.set(sceneId, newScene);

        return newScene;
    }

    createTransition(sceneId: TSceneId): TransitionBuilder<TState,TSceneId> {
        if (this.sceneBuilders.has(sceneId) || this.transitionSceneBuilders.has(sceneId)) {
            throw new Error(`Сцена или переход ${sceneId} уже существует.`);
        }

        const newScene = new TransitionBuilder<TState, TSceneId>();
        this.transitionSceneBuilders.set(sceneId, newScene);

        return newScene;
    }

    withWhatCanYouDo(whatCanYouDoHandler: ReplyHandler<TState>): void {
        if (this.whatCanYouDoHandler) {
            throw new Error(
                'Обработчик WhatCanYouDo уже задан. Возможно вы вызвали метод withwhatCanYouDo повторно.'
            );
        }

        this.whatCanYouDoHandler = whatCanYouDoHandler;
    }

    build(initialScene: TSceneId, initialState: TState): Dialog<TState, TSceneId> {
        const scenes = new Map<TSceneId, Scene<TState, TSceneId>>();
        const noop = () => {};

        for (const [sceneId, sceneBuilder] of this.sceneBuilders.entries()) {
            scenes.set(sceneId, sceneBuilder.build());
        }

        const transitions = new Map<TSceneId, Transition<TState, TSceneId>>();

        for (const [sceneId, transitionBuilder] of this.transitionSceneBuilders.entries()) {
            transitions.set(sceneId, transitionBuilder.build());
        }

        return new Dialog(scenes, transitions, initialScene, initialState, this.whatCanYouDoHandler || noop);
    }
}
