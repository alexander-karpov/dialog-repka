import { DialogsRequest } from './DialogsRequest';
import { Topic } from './Topic';

export class Input {
    static readonly TopicsStateProp = 'topicsState';

    constructor(public readonly request: DialogsRequest) {}

    async preprocess() {}

    get isNewSession(): boolean {
        return this.request.session.new;
    }

    get tokens(): string[] {
        return this.request.request.nlu.tokens;
    }

    get utterance(): string {
        return this.request.request.original_utterance;
    }

    get topicsState(): Topic[] {
        return this.request.state.session?.[Input.TopicsStateProp] ?? [];
    }
}

/*
            command,
            intents,
            request,

            entities: request.request.nlu.entities,
            messageIndex: request.session.message_id,
            random: this.random.getRandom(),
            isConfirm: intents && intents.hasOwnProperty(DialogsIntent.Confirm),
            isReject: intents && intents.hasOwnProperty(DialogsIntent.Reject),


                    const command = request.request.command.toLowerCase();
        const isHelpIntent = (intents && intents[DialogsIntent.Help]) || command === 'помощь';
        const isWhatCanYouDoIntent =
            (intents && intents[DialogsIntent.WhatCanYouDo]) || command === 'что ты умеешь';

 */
