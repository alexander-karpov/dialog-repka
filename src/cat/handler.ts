import { DialogsRequest } from '../DialogBuilder3/DialogsRequest';
import { DialogsResponse } from '../DialogBuilder3/DialogsResponse';
import { createCat } from './createCat';
import { MongoLogger } from '../MongoLogger';

const cat = createCat();
const logger = new MongoLogger('cat');

export const handler = async function (request: DialogsRequest): Promise<DialogsResponse> {
    const response = await cat.handleRequest(request);

    void logger.log(request, response);

    return response;
};
