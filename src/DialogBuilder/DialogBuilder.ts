import { Scene } from './Scene';
import { JustSceneBuilder } from './JustSceneBuilder';
import { Dialog } from './Dialog';
import { ReplyHandler } from './ReplyHandler';
import { TransitionScene } from './TransitionScene';
import { JustTransitionSceneBuilder } from './JustTransitionSceneBuilder';
import { TransitionSceneBuilder } from './TransitionSceneBuilder';

export type SetState<TState> = (patch: Partial<TState>) => void;

/**
 * @param TState Состояние будет доступно в методах определения сцены
 * @param TSceneId Можно указать список возможных сцен чтобы исключить случайную ошибку при их определении
 */
export class DialogBuilder<TState, TSceneId = string> {
    private whatCanYouDoHandler?: ReplyHandler<TState>;

    private readonly sceneBuilders: Map<
        TSceneId,
        JustSceneBuilder<TState, TSceneId>
    > = new Map();

    private readonly transitionSceneBuilders: Map<
        TSceneId,
        JustTransitionSceneBuilder<TState, TSceneId>
    > = new Map();

    createScene(SceneId: TSceneId) {
        if (this.sceneBuilders.has(SceneId) || this.transitionSceneBuilders.has(SceneId)) {
            throw new Error(`Сцена или переход ${SceneId} уже существует.`);
        }

        const newScene = new JustSceneBuilder<TState, TSceneId>();
        this.sceneBuilders.set(SceneId, newScene);

        return newScene;
    }

    createTransitionScene(SceneId: TSceneId): TransitionSceneBuilder<TState,TSceneId> {
        if (this.sceneBuilders.has(SceneId) || this.transitionSceneBuilders.has(SceneId)) {
            throw new Error(`Сцена или переход ${SceneId} уже существует.`);
        }

        const newScene = new JustTransitionSceneBuilder<TState, TSceneId>();
        this.transitionSceneBuilders.set(SceneId, newScene);

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

        const transitions = new Map<TSceneId, TransitionScene<TState, TSceneId>>();

        for (const [sceneId, transitionBuilder] of this.transitionSceneBuilders.entries()) {
            transitions.set(sceneId, transitionBuilder.build());
        }

        return new Dialog(scenes, transitions, initialScene, initialState, this.whatCanYouDoHandler || noop);
    }
}
