import { DialogsRequest } from '../DialogBuilder2/DialogsRequest';
import { DialogsResponse } from '../DialogBuilder2/DialogsResponse';
import { createHagi } from './createHagi';
import { setEventRequest } from './sendEvent';

const hagi = createHagi();

export const handler = async function (request: DialogsRequest): Promise<DialogsResponse> {
    setEventRequest(request);

    const response = await hagi.handleRequest(request);

    return response;
};
