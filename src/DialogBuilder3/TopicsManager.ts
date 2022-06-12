import assert from 'assert';
import { DialogsRequest } from './DialogsRequest';
import { DialogsResponse } from './DialogsResponse';
import { Input } from './Input';
import { BodyReply, Reply } from './ResponseBuilder';
import { Topic } from './Topic';
import { TopicOptions } from './TopicOptions';

import { ResponseBuilder } from './ResponseBuilder';

export class TopicsManager {
    private topics: (new () => Topic)[] = [];

    register(options: TopicOptions = {}) {
        return <T extends new () => Topic>(ctor: T): T => {
            assert(
                !this.topics.find((c) => c.name === ctor.name),
                `Топик с именем ${ctor.name} уже зарегистрирован`
            );

            this.topics.push(ctor);

            return ctor;
        };
    }

    update(request: DialogsRequest): DialogsResponse {
        const input = new Input(request);
        const restored = this.restoreTopics(input.topicsState);

        const response = new ResponseBuilder();

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

        return response.build(restored);
    }

    private updateTopics(topics: Topic[], input: Input) {
        type Proposal = { topic: Topic; continuation?: Function | false; replies: Reply[] };

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

    private restoreTopics(topicsState: Topic[]): Topic[] {
        const restored: Topic[] = [];

        for (const ctor of this.topics) {
            const state = topicsState.find((ts) => ts.$$type === ctor.name);

            restored.push(
                state
                    ? Object.create(ctor.prototype, Object.getOwnPropertyDescriptors(state))
                    : new ctor()
            );
        }

        return restored;
    }

    private defaultReply() {
        return new BodyReply('Я слышу, но полохо. Подойди поближе и повтори ещё разок.');
    }
}
