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
                $isDisposable = options.disposable;
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
        const restored = this.restoreTopics(input.topicsState);

        if (!restored.length) {
            restored.push(...this.defaultTopics());
        }

        const disposable = restored.filter((t) => t.$isDisposable);
        const notDisposable = restored.filter((t) => !t.$isDisposable);

        const reply =
            (await this.updateTopics(disposable, input)) ??
            (await this.updateTopics(notDisposable, input)) ??
            this.defaultReply(random);

        reply.withTopics(...notDisposable);

        return reply.build();
    }

    private async updateTopics(topics: Topic[], input: Input): Promise<ReplyBuilder | undefined> {
        const updated = await Promise.all(topics.map((t) => t.update(input)));

        return updated.find(Boolean);
    }

    private restoreTopics(topicsState: TopicEx[]): TopicEx[] {
        const restored: TopicEx[] = [];

        for (const state of topicsState) {
            const ctor = this.topicsCtors.get(state.$id);

            // М.б. у пользователя сохранилась сцена, которую мы удалили
            if (!ctor) {
                continue;
            }

            restored.push(Object.create(ctor.prototype, Object.getOwnPropertyDescriptors(state)));
        }

        return restored;
    }

    private defaultReply(random: RandomProvider): ReplyBuilder {
        const reply = new ReplyBuilder(random);

        reply.text('Я тебя слышу, но полохо. Подойди поближе и повтори ещё разок.');

        return reply;
    }

    private defaultTopics(): TopicEx[] {
        return this.defaultTopicsCtors.map((ctor) => new ctor());
    }
}
