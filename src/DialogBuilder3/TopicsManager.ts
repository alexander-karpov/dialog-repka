import assert from 'assert';
import { DialogsRequest } from './DialogsRequest';
import { DialogsResponse } from './DialogsResponse';
import { Input } from './Input';
import { RandomProvider } from './RandomProvider';
import { ReplyBuilder } from './ReplyBuilder';
import { Topic } from './Topic';
import { TopicOptions } from './TopicOptions';
import { TopicEx } from './TopicEx';

export class TopicsManager {
    private topicsCtors = new Map<string, new () => TopicEx>();
    private defaultTopicsCtors: Array<new () => TopicEx> = [];

    register(id: string, options: TopicOptions = {}) {
        return <T extends new () => Topic>(ctor: T): T => {
            // @ts-expect-error https://github.com/microsoft/TypeScript/issues/37142
            const withId = class extends ctor implements TopicEx {
                $id = id;
            };

            this.topicsCtors.set(id, withId);

            if (options.default) {
                this.defaultTopicsCtors.push(withId);
            }

            return withId;
        };
    }

    async update(request: DialogsRequest, random: RandomProvider): Promise<DialogsResponse> {
        const input = new Input(request);
        const disposable = input.topicsState.filter((t) => t.$isDisposable);
        const notDisposable = input.topicsState.filter((t) => !t.$isDisposable);

        if (!notDisposable.length) {
            notDisposable.push(...this.defaultTopics());
        }

        const reply =
            (await this.updateTopics(this.restoreTopics(disposable), input)) ??
            (await this.updateTopics(this.restoreTopics(notDisposable), input)) ??
            this.defaultReply(random);

        reply.withTopics(...notDisposable);

        return reply.build();
    }

    private async updateTopics(topics: Topic[], input: Input): Promise<ReplyBuilder | undefined> {
        const updated = await Promise.all(topics.map((t) => t.update(input)));

        return updated.find(Boolean);
    }

    private restoreTopics(topic: TopicEx[]): TopicEx[] {
        return topic.map((state) => {
            const ctor = this.topicsCtors.get(state.$id);
            assert(ctor, 'Все сцены были зарегистрированы');

            return Object.create(ctor.prototype, Object.getOwnPropertyDescriptors(state));
        });
    }

    private defaultReply(random: RandomProvider): ReplyBuilder {
        const reply = new ReplyBuilder(random);

        reply.withText('Я тебя слышу, но полохо. Подойди поближе и повтори ещё разок.');

        return reply;
    }

    private defaultTopics(): TopicEx[] {
        return this.defaultTopicsCtors.map((ctor) => new ctor());
    }
}
