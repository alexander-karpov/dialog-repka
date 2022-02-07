import { DialogsRequest } from './DialogsRequest';
import { DialogsIntents } from './DialogsIntents';

export type Input = Readonly<{
    command: string;
    tokens: string[];
    originalUtterance: string;
    messageIndex: number;
    intents: DialogsIntents;
    random: number;
    request: DialogsRequest;
    isConfirm: boolean;
    isReject: boolean;
}>;
