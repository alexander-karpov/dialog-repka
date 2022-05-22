import { DialogsRequest } from '../DialogBuilder2/DialogsRequest';
import { DialogsResponse } from '../DialogBuilder2/DialogsResponse';
import { createHagi } from './createHagi';
import { MongoLogger } from '../MongoLogger';

const hagi = createHagi();
const logger = new MongoLogger('hagi');

export const handler = async function (request: DialogsRequest): Promise<DialogsResponse> {
    const response = await hagi.handleRequest(request);

    void logger.log(request, response);

    return response;
};
