import { DialogsRequest } from './DialogsRequest';
import { DialogsIntents } from './DialogsIntents';

export interface Input {
    command: string;
    originalUtterance: string;
    messageIndex: number;
    intents: DialogsIntents;
    request: DialogsRequest;
    isConfirm: boolean;
    isReject: boolean;
}
