import { ReplyBuilder } from './ReplyBuilder';
import { DialogsSessionState } from './DialogsSessionState';
import { SceneProcessor } from './SceneProcessor';
import { DialogsRequest } from './DialogsRequest';
import { DialogsResponse } from './DialogsResponse';
import { DialogsIntent } from './DialogsIntent';
import { Input } from './Input';
import { ReplyHandler } from './ReplyHandler';
import { TransitionProcessor } from './TransitionProcessor';
import { Scene } from './Scene';
import { Transition } from './Transition';
import { DialogParams } from './DialogParams';
import { Startable } from './Startable';
import { Ending } from './Ending';
import { nameof } from './nameof';
import { wait } from './wait';
import { RandomProvider } from './RandomProvider';

export class Dialog<TSceneName extends string, TModel> {
    /** Оставим небольшой запас в 300мс */
    TIMEOUT = 2500;

    private readonly scenes = new Map<Startable<TSceneName>, SceneProcessor<TModel, TSceneName>>();
    private readonly endingsSceneNames: Set<Startable<TSceneName>> = new Set();
    private readonly Model: new () => TModel;
    private readonly whatCanYouDoHandler: ReplyHandler<TModel>;
    private readonly timeoutHanler?: ReplyHandler<TModel>;
    private readonly random: RandomProvider;

    private readonly transitions = new Map<
        Startable<TSceneName>,
        TransitionProcessor<TModel, TSceneName>
    >();

    constructor(
        Model: new () => TModel,
        {
            scenes,
            whatCanYouDo: whatCanYouDoHandler,
            timeout,
            random,
        }: DialogParams<TSceneName, TModel>
    ) {
        this.Model = Model;
        this.whatCanYouDoHandler = whatCanYouDoHandler ?? (() => ({}));
        this.timeoutHanler = timeout;
        this.random = random;

        for (const sceneName of Object.keys(scenes) as TSceneName[]) {
            const decl = scenes[sceneName];

            if (this.isScene<TModel>(decl)) {
                this.scenes.set(
                    sceneName,
                    new SceneProcessor<TModel, TSceneName>(
                        decl.onInput,
                        decl.reply,
                        decl.help,
                        decl.unrecognized
                    )
                );

                continue;
            }

            if (this.isTransition<TModel>(decl)) {
                this.transitions.set(
                    sceneName,
                    new TransitionProcessor(decl.onTransition, decl.reply)
                );
                continue;
            }

            if (this.isEnding<TModel>(decl)) {
                this.scenes.set(
                    sceneName,
                    new SceneProcessor<TModel, TSceneName>(() => 'Start', decl.reply)
                );
                this.endingsSceneNames.add(sceneName);

                continue;
            }

            throw new Error(
                `Элемент ${sceneName} не был распознан ни как сцена ни как переход или окончание.`
            );
        }
    }

    handleRequest = (request: DialogsRequest): Promise<DialogsResponse> => {
        const timeoutHanler = this.timeoutHanler;

        if (this.isPingRequest(request)) {
            return this.handlePing();
        }

        if (timeoutHanler) {
            const [timeoutPromise, disposeTimeout] = wait(this.TIMEOUT);

            return Promise.race<DialogsResponse>([
                timeoutPromise.then(() => this.replyToResponse(request, timeoutHanler)),
                this.handleUserRequest(request),
            ]).then((response) => {
                disposeTimeout();

                return response;
            });
        }

        return this.handleUserRequest(request);
    };

    private replyToResponse(
        request: DialogsRequest,
        handler: ReplyHandler<TModel>
    ): DialogsResponse {
        const reply = new ReplyBuilder(this.random);
        const [sceneName, model] = this.getOrCreateSessionState(request);

        handler(reply, model);

        return reply.build(sceneName, model, false);
    }

    private isPingRequest(request: DialogsRequest) {
        return request.request.original_utterance.includes('ping');
    }

    private handlePing(): Promise<DialogsResponse> {
        return Promise.resolve({
            response: { text: 'pong', end_session: true },
            version: '1.0',
        });
    }

    private async handleUserRequest(request: DialogsRequest): Promise<DialogsResponse> {
        const command = request.request.command.toLowerCase();

        const {
            nlu: { intents },
        } = request.request;

        const reply = new ReplyBuilder(this.random);
        const [sceneName, model] = this.getOrCreateSessionState(request);

        /**
         * При начале новой сессии, если у первой сцены (или перехода) есть reply,
         * то отрабатываем его, а не onInput. Так не придётся стартовой
         * делать сцену с одним только пустым onInput (если это нам не нужно).
         */
        const node = this.findTransition(sceneName) ?? this.getScene(sceneName);

        if (request.session.new && node.hasReply()) {
            const interruptSceneName = await this.applyTransitionsAndScene(sceneName, model, reply);

            return reply.build(
                interruptSceneName,
                model,
                this.endingsSceneNames.has(interruptSceneName)
            );
        }

        const scene = this.getScene(sceneName);

        const input: Input = {
            command,
            intents,
            request,
            isConfirm: intents && intents.hasOwnProperty(DialogsIntent.Confirm),
            isReject: intents && intents.hasOwnProperty(DialogsIntent.Reject),
        };

        /**
         * Обработка запроса «Помощь»
         */
        if ((intents && intents[DialogsIntent.Help]) || command === 'помощь') {
            scene.applyHelp(reply, model);

            return reply.build(sceneName, model, false);
        }

        /**
         * бработка запроса «Что ты умеешь»
         */

        if ((intents && input.intents[DialogsIntent.WhatCanYouDo]) || command === 'что ты умеешь') {
            this.whatCanYouDoHandler(reply, model);
            scene.applyHelp(reply, model);

            return reply.build(sceneName, model, false);
        }

        if (intents) {
            /**
             * Обработка запроса «Повтори» и подобных
             */
            if (input.intents[DialogsIntent.Repeat]) {
                scene.applyReply(reply, model);
                return reply.build(sceneName, model, false);
            }
        }

        const returnedSceneName = await scene.applyInput(input, model);

        /**
         * Unrecognized
         *
         * Обработка нераспознанного запроса, когда onInput возвращает undefined.
         * Добавляем unrecognized-ответ текущей сцены.
         * Состояние после onInput сохраняем, а $currentScene оставляем как был.
         */
        if (!returnedSceneName) {
            scene.applyUnrecognized(reply, model);

            return reply.build(sceneName, model, false);
        } else {
            const interruptSceneName = await this.applyTransitionsAndScene(
                returnedSceneName,
                model,
                reply
            );

            return reply.build(
                interruptSceneName,
                model,
                this.endingsSceneNames.has(interruptSceneName)
            );
        }
    }

    private getOrCreateSessionState(request: DialogsRequest): [Startable<TSceneName>, TModel] {
        const sessionState = request.state && request.state.session;

        if (this.isNotEmptySessionState(sessionState)) {
            const model = sessionState.data;

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            model.__proto__ = this.Model.prototype;

            return [sessionState.sceneName, model];
        }

        return ['Start', new this.Model()];
    }

    /**
     * Попадаем сюда после отработки функции onInput.
     * Здесь мы отрабатываем переходы (transition), если они есть и
     * reply у достигнутой таким образом цвены.
     */
    private async applyTransitionsAndScene(
        currentScene: Startable<TSceneName>,
        state: TModel,
        reply: ReplyBuilder
    ): Promise<Startable<TSceneName>> {
        const nextSceneName = await this.applyTransitions(currentScene, state, reply);

        const scene = this.getScene(nextSceneName);
        scene.applyReply(reply, state);

        return nextSceneName;
    }

    private async applyTransitions(
        currentScene: Startable<TSceneName>,
        state: TModel,
        output: ReplyBuilder
    ): Promise<Startable<TSceneName>> {
        const scene = this.findTransition(currentScene);

        if (!scene) {
            return currentScene;
        }

        scene.applyReply(output, state);
        const x = await scene.applyTransition(state);
        return this.applyTransitions(x, state, output);
    }

    private findTransition(sceneName: Startable<TSceneName>) {
        return this.transitions.get(sceneName);
    }

    private getScene(sceneName: Startable<TSceneName>): SceneProcessor<TModel, TSceneName> {
        const scene = this.scenes.get(sceneName);

        if (!scene) {
            throw new Error(`Сцена ${sceneName} не определена.`);
        }

        return scene;
    }

    private isNotEmptySessionState(
        sessionState: DialogsSessionState<TModel, TSceneName> | {}
    ): sessionState is DialogsSessionState<TModel, TSceneName> {
        const sceneNamePropName = nameof<DialogsSessionState<unknown, ''>>('sceneName');
        const dataPropName = nameof<DialogsSessionState<unknown, ''>>('data');

        return sessionState && sceneNamePropName in sessionState && dataPropName in sessionState;
    }

    private isScene<TModel>(decl: any): decl is Scene<TModel, TSceneName> {
        const scenePropName = nameof<Scene<{}, ''>>('onInput');

        return typeof decl[scenePropName] === 'function';
    }

    private isTransition<TModel>(decl: any): decl is Transition<TModel, TSceneName> {
        const transitionPropName = nameof<Transition<{}, ''>>('onTransition');

        return typeof decl[transitionPropName] === 'function';
    }

    private isEnding<TModel>(decl: any): decl is Ending<TModel> {
        const transitionPropName = nameof<Transition<{}, ''>>('onTransition');
        const scenePropName = nameof<Scene<{}, ''>>('onInput');

        return (
            typeof decl[transitionPropName] === 'undefined' &&
            typeof decl[scenePropName] === 'undefined'
        );
    }
}
