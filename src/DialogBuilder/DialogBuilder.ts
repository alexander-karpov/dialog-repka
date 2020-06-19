import { Scene } from './Scene';
import { JustSceneBuilder } from './JustSceneBuilder';
import { Dialog } from './Dialog';
import { ReplyConstructor } from './ReplyConstructor';

export type SetState<TState> = (patch: Partial<TState>) => void;

/**
 * @param TState Состояние будет доступно в методах определения сцены
 * @param TSceneId Можно указать список возможных сцен чтобы исключить случайную ошибку при их определении
 */
export class DialogBuilder<TState, TSceneId = string> {
    private whatCanYouDoHandler?: ReplyConstructor<TState>;

    private readonly sceneBuilders: Map<
        TSceneId,
        JustSceneBuilder<TState, TSceneId>
    > = new Map();

    createScene(SceneId: TSceneId) {
        if (this.sceneBuilders.has(SceneId)) {
            throw new Error(`Сцена ${SceneId} уже существует.`);
        }

        const newScene = new JustSceneBuilder<TState, TSceneId>();
        this.sceneBuilders.set(SceneId, newScene);

        return newScene;
    }

    withWhatCanYouDo(whatCanYouDoHandler: ReplyConstructor<TState>): void {
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
            scenes.set(sceneId, sceneBuilder.build(sceneId));
        }

        return new Dialog(scenes, initialScene, initialState, this.whatCanYouDoHandler || noop);
    }
}
