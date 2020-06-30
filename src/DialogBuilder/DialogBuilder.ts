import { SceneProcessor } from './SceneProcessor';
import { SceneBuilder } from './SceneBuilder';
import { Dialog } from './Dialog';
import { ReplyHandler } from './ReplyHandler';
import { TransitionProcessor } from './TransitionProcessor';
import { TransitionBuilder } from './TransitionBuilder';
import { Scene } from './Scene';
import { Transition } from './Transition';
import { assert } from 'console';

export type SetState<TState> = (patch: Partial<TState>) => void;

/**
 * @param TState Состояние будет доступно в методах определения сцены
 * @param TSceneId Можно указать список возможных сцен чтобы исключить случайную ошибку при их определении
 */
export class DialogBuilder<TState, TSceneId extends string = string> {
    private whatCanYouDoHandler?: ReplyHandler<TState>;

    private readonly sceneBuilders: Map<TSceneId, SceneBuilder<TState, TSceneId>> = new Map();

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

    createTransition(sceneId: TSceneId): TransitionBuilder<TState, TSceneId> {
        if (this.sceneBuilders.has(sceneId) || this.transitionSceneBuilders.has(sceneId)) {
            throw new Error(`Сцена или переход ${sceneId} уже существует.`);
        }

        const newScene = new TransitionBuilder<TState, TSceneId>();
        this.transitionSceneBuilders.set(sceneId, newScene);

        return newScene;
    }

    addScene(sceneId: TSceneId, sceneDecl: Scene<TState, TSceneId>): void {
        const scene = this.createScene(sceneId);

        scene.withInput(sceneDecl.onInput);

        if (sceneDecl.reply) {
            scene.withReply(sceneDecl.reply);
        }

        if (sceneDecl.help) {
            scene.withHelp(sceneDecl.help);
        }

        if (sceneDecl.unrecognized) {
            scene.withUnrecognized(sceneDecl.unrecognized);
        }
    }

    addTransition(sceneId: TSceneId, decl: Transition<TState, TSceneId>): void {
        const transition = this.createTransition(sceneId);

        transition.withTransition(decl.onTransition);

        if (decl.reply) {
            transition.withReply(decl.reply);
        }
    }

    addScenes(
        sceneDecls: Record<TSceneId, Scene<TState, TSceneId> | Transition<TState, TSceneId>>
    ): void {
        for (let sceneId of Object.keys(sceneDecls)) {
            const decl: Scene<TState, TSceneId> | Transition<TState, TSceneId> =
                sceneDecls[sceneId as TSceneId];

            if (this.isSceneDecl<TState, TSceneId>(decl)) {
                this.addScene(sceneId as TSceneId, decl);
                continue;
            }

            if (this.isTransitionDecl<TState, TSceneId>(decl)) {
                this.addTransition(sceneId as TSceneId, decl);
                continue;
            }

            throw new Error(`Элемент ${sceneId} не был распознан ни как сцена ни как переход.`);
        }
    }

    private isSceneDecl<TState, TSceneId>(decl: any): decl is Scene<TState, TSceneId> {
        return typeof decl.onInput === 'function';
    }

    private isTransitionDecl<TState, TSceneId>(
        decl: any
    ): decl is Transition<TState, TSceneId> {
        return typeof decl.onTransition === 'function';
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
        const scenes = new Map<TSceneId, SceneProcessor<TState, TSceneId>>();
        const noop = () => {};

        for (const [sceneId, sceneBuilder] of this.sceneBuilders.entries()) {
            scenes.set(sceneId, sceneBuilder.build());
        }

        const transitions = new Map<TSceneId, TransitionProcessor<TState, TSceneId>>();

        for (const [sceneId, transitionBuilder] of this.transitionSceneBuilders.entries()) {
            transitions.set(sceneId, transitionBuilder.build());
        }

        return new Dialog(
            scenes,
            transitions,
            initialScene,
            initialState,
            this.whatCanYouDoHandler || noop
        );
    }
}
