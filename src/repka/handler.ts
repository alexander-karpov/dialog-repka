import { DialogsRequest } from '../DialogBuilder2/DialogsRequest';
import { DialogsResponse } from '../DialogBuilder2/DialogsResponse';
import { createRepka } from './createRepka';
import { setEventRequest } from './sendEvent';

const repka = createRepka();
export const handler = function (request: DialogsRequest): Promise<DialogsResponse> {
    setEventRequest(request);

    return repka.handleRequest(request);
};
