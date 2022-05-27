import { DialogsRequest } from './DialogsRequest';
import { DialogsResponse } from './DialogsResponse';

export type RequestHandler = (request: DialogsRequest) => Promise<DialogsResponse>;
