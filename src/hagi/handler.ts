import { DialogsRequest } from '../DialogBuilder2/DialogsRequest';
import { DialogsResponse } from '../DialogBuilder2/DialogsResponse';
import { createHagi } from './createHagi';
import { setEventRequest } from './sendEvent';
import { MongoLogger } from '../MongoLogger';

const hagi = createHagi();
const logger = new MongoLogger('hagi');

export const handler = async function (request: DialogsRequest): Promise<DialogsResponse> {
    setEventRequest(request);

    const response = await hagi.handleRequest(request);

    void logger.log(request, response);

    return response;
};
