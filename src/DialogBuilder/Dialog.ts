import { ReplyBuilder } from './ReplyBuilder';
import { JustReplyBuilder } from './JustReplyBuilder';
import { SessionState } from './SessionState';
import { Scene } from './Scene';
import { DialogRequest } from './DialogRequest';
import { DialogResponse } from './DialogResponse';
import { DialogIntent } from './DialogIntent';
import { InputData } from './InputData';
import { ReplyConstructor } from './ReplyConstructor';
// TODO: Терминальная цвена не должна быть без представления

/**
 * @param TState
 *  Состояние будет доступно в методах определения сцены
 *  Важно: состояние должно сериализоваться и десериализоваться через JSON. Т.е. нельзя использовать классы с методами.
 * @param TSceneId Можно указать список возможных сцен чтобы исключить случайную ошибку при их определении
 */
export class Dialog<TState, TSceneId = string> {
    constructor(
        private readonly scenes: Map<TSceneId, Scene<TState, TSceneId>>,
        private readonly initialScene: TSceneId,
        private readonly initialState: TState,
        private readonly whatCanYouDoHandler: ReplyConstructor<TState>
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

        const inputData: InputData = {
            command: command.toLowerCase(),
            intents,
            request,
            isConfirm: intents.hasOwnProperty(DialogIntent.Confirm),
            isReject: intents.hasOwnProperty(DialogIntent.Reject),
        };

        const sessionState = request.state && request.state.session;

        const context: SessionState<TState, TSceneId> = this.isNotEmptySessionState(sessionState)
            ? sessionState
            : this.createInitialContext();

        const output = new JustReplyBuilder();

        const scene = this.getScene(context.$currentScene);

        if (intents) {
            /**
             * Обработка запроса «Помощь» и «Что ты умеешь»
             */
            if (inputData.intents[DialogIntent.Help]) {
                scene.appendHelp(output, context.state);

                return output.build(context);
            }

            if (inputData.intents[DialogIntent.WhatCanYouDo]) {
                this.whatCanYouDoHandler(output, context.state);
                scene.appendHelp(output, context.state);

                return output.build(context);
            }

            /**
             * Обработка запроса «Повтори» и подобных
             */
            if (inputData.intents[DialogIntent.Repeat]) {
                scene.appendReply(output, context.state);
                return output.build(context);
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
            scene.appendUnrecognized(output, context.state);
            return output.build({ state: stateAfterInput, $currentScene: context.$currentScene });
        }

        const contextAfterScenes = await this.goThroughScenes(
            { state: stateAfterInput, $currentScene: sceneAfterInput },
            output
        );

        return output.build(contextAfterScenes);
    }

    private async goThroughScenes(
        context: SessionState<TState, TSceneId>,
        output: ReplyBuilder
    ): Promise<SessionState<TState, TSceneId>> {
        const scene = this.getScene(context.$currentScene);

        scene.appendReply(output, context.state);
        const contextAfterTransition = await scene.applyTransition(context.state);

        if (
            contextAfterTransition.state !== context.state &&
            contextAfterTransition.$currentScene !== context.$currentScene
        ) {
            return this.goThroughScenes(contextAfterTransition, output);
        }

        return context;
    }

    private getScene(SceneId: TSceneId): Scene<TState, TSceneId> {
        const scene = this.scenes.get(SceneId);

        if (!scene) {
            throw new Error(`Сцена ${SceneId} не существует.`);
        }

        return scene;
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
