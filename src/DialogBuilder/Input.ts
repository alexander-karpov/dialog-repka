import { DialogRequest } from './DialogRequest';

export interface Input {
    command: string;
    intents: Record<string, unknown>;
    request: DialogRequest;
    isConfirm: boolean;
    isReject: boolean;
};
