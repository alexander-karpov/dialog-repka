import { DialogsRequest } from '../DialogBuilder2/DialogsRequest';
import { DialogsResponse } from '../DialogBuilder2/DialogsResponse';
import { createRepka } from './createRepka';
import { setEventRequest } from './sendEvent';
import { MongoLogger } from '../MongoLogger';

const repka = createRepka();
const logger = new MongoLogger('repka');

export const handler = async function (request: DialogsRequest): Promise<DialogsResponse> {
    setEventRequest(request);

    const response = await repka.handleRequest(request);

    void logger.log(request, response);

    return response;
};
