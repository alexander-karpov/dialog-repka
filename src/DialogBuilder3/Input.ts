import { DialogsRequest } from './DialogsRequest';
import { TopicEx } from './TopicEx';

export class Input {
    constructor(public readonly request: DialogsRequest) {}

    get tokens(): string[] {
        return this.request.request.nlu.tokens;
    }

    get utterance(): string {
        return this.request.request.original_utterance;
    }

    get topicsState(): TopicEx[] {
        return this.request.state.session?.topics ?? [];
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
