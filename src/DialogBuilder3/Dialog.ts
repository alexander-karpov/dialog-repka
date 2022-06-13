import { DialogsRequest } from './DialogsRequest';
import { DialogsResponse } from './DialogsResponse';
import { Input } from './Input';
import { ResponseBuilder } from './ResponseBuilder';
import { TopicOptions } from './TopicOptions';
import { TopicsManager } from './TopicsManager';

export class Dialog {
    readonly TIMEOUT = 2500;
    private readonly topicsManager = new TopicsManager();
    private inputCtor = Input;

    input = (ctor: typeof Input) => {
        this.inputCtor = ctor;
    };

    register = (options: TopicOptions = {}) => {
        return this.topicsManager.register(options);
    };

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

    private async handleUserRequest(request: DialogsRequest): Promise<DialogsResponse> {
        const response = new ResponseBuilder();
        const input = new this.inputCtor(request);

        await input.preprocess();
        this.topicsManager.update(input, response);

        return response.build();
    }
}
