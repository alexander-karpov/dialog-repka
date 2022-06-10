import assert from 'assert';
import { DialogsRequest } from './DialogsRequest';
import { DialogsResponse } from './DialogsResponse';
import { Input } from './Input';
import { BodyReply, Reply } from './ResponseBuilder';
import { Topic } from './Topic';
import { TopicOptions } from './TopicOptions';
import { TopicEx } from './TopicEx';
import { ResponseBuilder } from './ResponseBuilder';

export class TopicsManager {
    private topicsCtors = new Map<string, new () => TopicEx>();
    private defaultTopicsCtors: Array<new () => TopicEx> = [];

    register(options: TopicOptions = {}) {
        return <T extends new () => Topic>(ctor: T): T => {
            assert(
                !this.topicsCtors.has(ctor.name),
                `Топик с именем ${ctor.name} уже зарегистрирован`
            );

            // @ts-expect-error https://github.com/microsoft/TypeScript/issues/37142
            const ctorEx = class extends ctor implements TopicEx {
                $$type = ctor.name;
            };

            this.topicsCtors.set(ctor.name, ctorEx);

            if (options.default) {
                this.defaultTopicsCtors.push(ctorEx);
            }

            return ctorEx;
        };
    }

    update(request: DialogsRequest): DialogsResponse {
        const input = new Input(request);
        const restored = this.restoreTopics(input.topicsState);

        if (!restored.length) {
            restored.push(...this.defaultTopics());
        }

        // const disposable = restored.filter((t) => t.$$isContinuationOf);
        // const notDisposable = restored.filter((t) => !t.$$isContinuationOf);

        // const reply =
        //     (await this.updateTopics(disposable, input)) ??
        //     (await this.updateTopics(notDisposable, input)) ??
        //     this.defaultReply(random);

        const response = new ResponseBuilder();

        response.withTopics(...restored);

        const proposals = this.updateTopics(restored, input);

        const runningScript = proposals.find((p) => p.topic.$$continuation);
        const withContinuation = proposals.find((p) => p.continuation);
        const withReply = proposals[0];

        const selected = runningScript ?? withContinuation ?? withReply;

        if (selected) {
            for (const reply of selected.replies) {
                reply.addTo(response);
            }

            if (typeof selected.continuation === 'function') {
                selected.topic.$$continuation = selected.continuation.name;
            }

            if (selected.continuation === false) {
                selected.topic.$$continuation = undefined;
            }
        } else {
            this.defaultReply().addTo(response);
        }

        return response.build();
    }

    private updateTopics(topics: TopicEx[], input: Input) {
        type Proposal = { topic: TopicEx; continuation?: Function | false; replies: Reply[] };

        const result: Proposal[] = [];

        for (const topic of topics) {
            const proposal = topic.$$continuation
                ? // @ts-expect-error
                  topic[topic.$$continuation](input)
                : topic.update(input);

            if (!proposal?.replies.length) {
                continue;
            }

            result.push({
                topic,
                ...proposal,
            });
        }

        return result;
    }

    private restoreTopics(topicsState: TopicEx[]): TopicEx[] {
        const restored: TopicEx[] = [];

        for (const state of topicsState) {
            const ctor = this.topicsCtors.get(state.$$type);

            // М.б. у пользователя сохранилась сцена, которую мы удалили
            if (!ctor) {
                continue;
            }

            restored.push(Object.create(ctor.prototype, Object.getOwnPropertyDescriptors(state)));
        }

        return restored;
    }

    private defaultReply() {
        return new BodyReply('Я слышу, но полохо. Подойди поближе и повтори ещё разок.');
    }

    private defaultTopics(): TopicEx[] {
        return this.defaultTopicsCtors.map((ctor) => new ctor());
    }
}
