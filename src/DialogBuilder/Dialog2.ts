import { ReplyBuilder } from './ReplyBuilder';
import { SessionState } from './SessionState';
import { SceneProcessor } from './SceneProcessor';
import { DialogRequest } from './DialogRequest';
import { DialogResponse } from './DialogResponse';
import { DialogIntent } from './DialogIntent';
import { Input } from './Input';
import { ReplyHandler } from './ReplyHandler';
import { TransitionProcessor } from './TransitionProcessor';
import { Scene } from './Scene';
import { Transition } from './Transition';
import { RequestHandler } from './RequestHandler';
// TODO: Терминальная цвена не должна быть без представления
// TODO: Добавить защиту от зацикливания

interface DialogParams<TState, TSceneId extends string> {
    scenes: Record<TSceneId, Scene<TState, TSceneId> | Transition<TState, TSceneId>>;
    startScene: TSceneId;
    state: () => TState;
    whatCanYouDo: ReplyHandler<TState>;
}

/**
 * @param TState
 *  Состояние будет доступно в методах определения сцены
 *  Важно: состояние должно сериализоваться и десериализоваться через JSON. Т.е. нельзя использовать классы с методами.
 * @param TSceneId Можно указать список возможных сцен чтобы исключить случайную ошибку при их определении
 */
export class Dialog<TState, TSceneId extends string = string> implements RequestHandler {
    private readonly scenes: Map<TSceneId, SceneProcessor<TState, TSceneId>> = new Map();
    private readonly transitionScenes: Map<TSceneId, TransitionProcessor<TState, TSceneId>> = new Map();
    private readonly startScene: TSceneId;
    private readonly state: () => TState;
    private readonly whatCanYouDoHandler: ReplyHandler<TState>;

    constructor({
        scenes,
        startScene: initialScene,
        state,
        whatCanYouDo: whatCanYouDoHandler,
    }: DialogParams<TState, TSceneId>) {
        this.startScene = initialScene;
        this.state = state;
        this.whatCanYouDoHandler = whatCanYouDoHandler;

        for (let sceneId of Object.keys(scenes) as TSceneId[]) {
            const decl = scenes[sceneId];

            if (this.isSceneDecl<TState, TSceneId>(decl)) {
                this.scenes.set(
                    sceneId,
                    new SceneProcessor<TState, TSceneId>(
                        decl.onInput,
                        decl.reply,
                        decl.help,
                        decl.unrecognized
                    )
                );

                continue;
            }

            if (this.isTransitionDecl<TState, TSceneId>(decl)) {
                this.transitionScenes.set(sceneId, new TransitionProcessor(decl.onTransition, decl.reply));
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

    handleRequest(request: DialogRequest): Promise<DialogResponse> {
        if (this.isPingRequest(request)) {
            return this.handlePingRequest();
        }

        return this.handleUserRequest(request);
    }

    private isPingRequest(request: DialogRequest) {
        return request.request.original_utterance.includes('ping');
    }

    private handlePingRequest(): Promise<DialogResponse> {
        return Promise.resolve({
            response: { text: 'pong', end_session: true },
            version: '1.0',
        });
    }

    private async handleUserRequest(request: DialogRequest): Promise<DialogResponse> {
        const {
            command,
            nlu: { intents },
        } = request.request;

        const inputData: Input = {
            command: command.toLowerCase(),
            intents,
            request,
            isConfirm: intents && intents.hasOwnProperty(DialogIntent.Confirm),
            isReject: intents && intents.hasOwnProperty(DialogIntent.Reject),
        };

        const sessionState = request.state && request.state.session;

        const context: SessionState<TState, TSceneId> = this.isNotEmptySessionState(sessionState)
            ? sessionState
            : this.createInitialContext();

        const reply = new ReplyBuilder();

        const scene = this.getScene(context.$currentScene);

        if (intents) {
            /**
             * Обработка запроса «Помощь» и «Что ты умеешь»
             */
            if (inputData.intents[DialogIntent.Help]) {
                scene.applyHelp(reply, context.state);

                return reply.build(context);
            }

            if (inputData.intents[DialogIntent.WhatCanYouDo]) {
                this.whatCanYouDoHandler(reply, context.state);
                scene.applyHelp(reply, context.state);

                return reply.build(context);
            }

            /**
             * Обработка запроса «Повтори» и подобных
             */
            if (inputData.intents[DialogIntent.Repeat]) {
                scene.applyReply(reply, context.state);
                return reply.build(context);
            }
        }

        const { state: stateAfterInput, $currentScene: sceneAfterInput } = await scene.applyInput(
            inputData,
            context.state
        );

        /**
         * Обработка нераспознанного запроса, когда Input возвращает undefined
         */
        if (!sceneAfterInput) {
            scene.applyUnrecognized(reply, context.state);
            return reply.build({ state: stateAfterInput, $currentScene: context.$currentScene });
        }

        const contextAfterTransition = await this.playTransitionScenes(
            { state: stateAfterInput, $currentScene: sceneAfterInput },
            reply
        );

        const terminalScene = this.getScene(contextAfterTransition.$currentScene);

        terminalScene.applyReply(reply, contextAfterTransition.state);

        return reply.build(contextAfterTransition);
    }

    private async playTransitionScenes(
        context: SessionState<TState, TSceneId>,
        output: ReplyBuilder
    ): Promise<SessionState<TState, TSceneId>> {
        const scene = this.findTransitionScene(context.$currentScene);

        if (!scene) {
            return context;
        }

        scene.applyReply(output, context.state);
        return this.playTransitionScenes(await scene.applyTransition(context.state), output);
    }

    private getScene(SceneId: TSceneId): SceneProcessor<TState, TSceneId> {
        const scene = this.scenes.get(SceneId);

        if (!scene) {
            throw new Error(`Сцена ${SceneId} не существует.`);
        }

        return scene;
    }

    private findTransitionScene(SceneId: TSceneId): TransitionProcessor<TState, TSceneId> | undefined {
        return this.transitionScenes.get(SceneId);
    }

    private createInitialContext(): SessionState<TState, TSceneId> {
        return {
            state: this.state(),
            $currentScene: this.startScene,
        };
    }

    private isNotEmptySessionState(
        sessionState: SessionState<TState, TSceneId> | {}
    ): sessionState is SessionState<TState, TSceneId> {
        return sessionState && '$currentScene' in sessionState && 'state' in sessionState;
    }
}
