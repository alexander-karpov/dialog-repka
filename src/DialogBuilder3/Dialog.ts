import { DialogsRequest } from './DialogsRequest';
import { DialogsResponse } from './DialogsResponse';
import { RandomProvider } from './RandomProvider';
import { TopicOptions } from './TopicOptions';
import { TopicsManager } from './TopicsManager';

export class Dialog {
    readonly TIMEOUT = 2500;
    private readonly topicsManager = new TopicsManager();

    constructor(private readonly random: RandomProvider) {}

    register(options: TopicOptions = {}) {
        return this.topicsManager.register(options);
    }

    async handleRequest(request: DialogsRequest): Promise<DialogsResponse> {
        if (this.isPingRequest(request)) {
            return this.handlePing();
        }

        return this.handleUserRequest(request);
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

    private handleUserRequest(request: DialogsRequest): DialogsResponse {
        return this.topicsManager.update(request);
    }
}
