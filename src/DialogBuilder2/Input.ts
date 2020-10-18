import { DialogsRequest } from './DialogsRequest';
import { DialogsIntents } from './DialogsIntents';

export interface Input {
    command: string;
    intents: DialogsIntents;
    request: DialogsRequest;
    isConfirm: boolean;
    isReject: boolean;
}
