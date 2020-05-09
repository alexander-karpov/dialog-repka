import { DialogRequest } from './DialogRequest';

export interface InputData {
    command: string;
    intents: Record<string, unknown>;
    request: DialogRequest;
};
