import { ReplyBuilder } from './ReplyBuilder';
import { SessionState } from './SessionState';
import { SceneProcessor } from './SceneProcessor';
import { DialogRequest } from './DialogRequest';
import { DialogResponse } from './DialogResponse';
import { DialogBuildinIntent } from './DialogBuildinIntent';
import { Input } from './Input';
import { ReplyHandler } from './ReplyHandler';
import { TransitionProcessor } from './TransitionProcessor';
import { RequestHandler } from './RequestHandler';
// TODO: Терминальная цвена не должна быть без представления
// TODO: Добавить защиту от зацикливания

/**
 * @param TState
 *  Состояние будет доступно в методах определения сцены
 *  Важно: состояние должно сериализоваться и десериализоваться через JSON. Т.е. нельзя использовать классы с методами.
 * @param TSceneId Можно указать список возможных сцен чтобы исключить случайную ошибку при их определении
 */
export class Dialog<TState, TSceneId = string>  implements RequestHandler {
    constructor(
        private readonly scenes: Map<TSceneId, SceneProcessor<TState, TSceneId>>,
        private readonly transitionScenes: Map<TSceneId, TransitionProcessor<TState, TSceneId>>,
        private readonly initialScene: TSceneId,
        private readonly initialState: TState,
        private readonly whatCanYouDoHandler: ReplyHandler<TState>
    ) {}

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
            isConfirm: intents && intents.hasOwnProperty(DialogBuildinIntent.Confirm),
            isReject: intents && intents.hasOwnProperty(DialogBuildinIntent.Reject),
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
            if (inputData.intents[DialogBuildinIntent.Help]) {
                scene.applyHelp(reply, context.state);

                return reply.build(context);
            }

            if (inputData.intents[DialogBuildinIntent.WhatCanYouDo]) {
                this.whatCanYouDoHandler(reply, context.state);
                scene.applyHelp(reply, context.state);

                return reply.build(context);
            }

            /**
             * Обработка запроса «Повтори» и подобных
             */
            if (inputData.intents[DialogBuildinIntent.Repeat]) {
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
            state: this.initialState,
            $currentScene: this.initialScene,
        };
    }

    private isNotEmptySessionState(
        sessionState: SessionState<TState, TSceneId> | {}
    ): sessionState is SessionState<TState, TSceneId> {
        return sessionState && '$currentScene' in sessionState && 'state' in sessionState;
    }
}
