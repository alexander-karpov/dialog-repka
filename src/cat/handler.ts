import { DialogsRequest } from '../DialogBuilder3/DialogsRequest';
import { DialogsResponse } from '../DialogBuilder3/DialogsResponse';
import { dialog } from './dialog';
import { MongoLogger } from '../MongoLogger';

const logger = new MongoLogger('cat');

export const handler = async function (request: DialogsRequest): Promise<DialogsResponse> {
    const response = await dialog.handleRequest(request);

    void logger.log(request, response);

    return response;
};
