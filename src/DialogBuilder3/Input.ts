import { DialogsRequest } from './DialogsRequest';
import { DialogsEntity, DialogsIntents } from './DialogsIntents';

export type Input = Readonly<{
    command: string;
    tokens: string[];
    entities: DialogsEntity[];
    originalUtterance: string;
    messageIndex: number;
    intents: DialogsIntents;
    random: number;
    request: DialogsRequest;
    isConfirm: boolean;
    isReject: boolean;
}>;
