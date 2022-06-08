import { Topic } from '.';
import { DialogsRequest } from './DialogsRequest';
import { TopicEx } from './TopicEx';

export class Input {
    constructor(public readonly request: DialogsRequest) {}

    // Предподготовка свойств
    async prepare(): Promise<void> {}

    get topicsState(): TopicEx[] {
        return this.request.state.session?.topics ?? [];
    }
}

/*
            command,
            intents,
            request,
            originalUtterance: request.request.original_utterance,
            tokens: request.request.nlu.tokens,
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
