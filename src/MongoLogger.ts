import { Collection, MongoClient, MongoClientOptions } from 'mongodb';
import { DialogsRequest } from './DialogBuilder2/DialogsRequest';
import { DialogsResponse } from './DialogBuilder2/DialogsResponse';

const DB_RS = 'rs01';
const DB_NAME = 'skills';
const DB_HOSTS = ['rc1c-gtjrhjmixjcjdjw8.mdb.yandexcloud.net:27018'];
const DB_USER = 'kukuruku';
const DB_PASS = <string>process.env.POSTGRESQL_PASSWORD;
const CACERT = './root.crt';

const url = `mongodb://${DB_USER}:${DB_PASS}@${DB_HOSTS.join(',')}/`;

const options: MongoClientOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    replicaSet: DB_RS,
    authSource: DB_NAME,
    tls: true,
    tlsCAFile: CACERT,
    w: 0,
};

export class MongoLogger {
    private client?: MongoClient;

    async log(request: DialogsRequest, response: DialogsResponse): Promise<void> {
        const collection = await this.ensureCollection();

        await collection.insertOne({
            request: request.request.command,
            message_id: request.session.message_id,
            session_id: request.session.session_id,
            response: response.response.text.substring(0, 64),
            time: new Date().getTime(),
            version: 2,
        });
    }

    private async ensureClient(): Promise<MongoClient> {
        if (!this.client) {
            this.client = await MongoClient.connect(url, options);
        }

        return this.client;
    }

    private async ensureCollection(): Promise<Collection> {
        const client = await this.ensureClient();

        const db = client.db(DB_NAME);
        const collection = db.collection('repka_logs');

        return collection;
    }
}
