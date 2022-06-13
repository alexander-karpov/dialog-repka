import assert from 'assert';
import { DialogsRequest } from './DialogsRequest';
import { DialogsResponse } from './DialogsResponse';
import { Input } from './Input';
import { Reply } from './Reply';
import { Topic } from './Topic';
import { TopicOptions } from './TopicOptions';

import { ResponseBuilder } from './ResponseBuilder';
import { TopicProposal } from './TopicProposal';

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

    update(input: Input, response: ResponseBuilder) {
        const restored = this.restoreTopics(input.topicsState);

        const proposals = this.updateTopics(restored, input);

        const runningScript = proposals.find((p) => p.topic.$$continuation);
        const withContinuation = proposals.find((p) => p.continuation);
        const withReply = proposals[0];

        const selected = runningScript ?? withContinuation ?? withReply;

        if (selected) {
            selected.body.addTo(response);

            if (typeof selected.continuation === 'function') {
                selected.topic.$$continuation = selected.continuation.name;
            }

            if (selected.continuation === false) {
                selected.topic.$$continuation = undefined;
            }
        } else {
            this.defaultReply().addTo(response);
        }

        response.topics(restored);
    }

    private updateTopics(topics: Topic[], input: Input) {
        type Proposal = { topic: Topic; continuation?: Function | false; body: Reply };

        const result: Proposal[] = [];

        for (const topic of topics) {
            const proposal =
                topic.$$continuation && Reflect.has(topic, topic.$$continuation)
                    ? // @ts-expect-error
                      (topic[topic.$$continuation](input) as TopicProposal | undefined)
                    : topic.update(input);

            if (!proposal?.body) {
                continue;
            }

            result.push({
                topic,
                body: proposal.body,
                continuation: proposal.continuation,
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
        return new Reply('Я слышу, но полохо. Подойди поближе и повтори ещё разок.');
    }
}
