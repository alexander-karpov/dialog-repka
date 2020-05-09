import { DialogRequest } from './DialogRequest';

export interface RequestData {
    command: string;
    intents: Record<string, unknown>;
    request: DialogRequest<unknown>;
};
