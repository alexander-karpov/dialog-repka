import { Collection, MongoClient, MongoClientOptions } from 'mongodb';
import * as assert from 'assert';

const DB_RS = 'rs01';
const DB_NAME = 'dialogs';
const DB_HOSTS = ['rc1c-kdxir3d58wsmgl79.mdb.yandexcloud.net:27018'];
const DB_USER = 'kukuruku';
const DB_PASS = <string>process.env.MONGODB_DIALOGS_PASSWORD;
const CACERT = './root.crt';

const url = `mongodb://${DB_USER}:${DB_PASS}@${DB_HOSTS.join(',')}/`;

const options: MongoClientOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    replicaSet: DB_RS,
    authSource: DB_NAME,
    tls: true,
    tlsCAFile: CACERT
};

export class MongoDbCollection<TData> {
    private client?: MongoClient;

    constructor(private collectionName: string) {}

    async save(id: string, data: TData): Promise<void> {
        const collection = await this.ensureCollection();

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        await collection.updateOne({ _id: id }, { $set: data }, { upsert: true });
    }

    async find(id: string): Promise<TData | undefined> {
        const collection = await this.ensureCollection();

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return collection.findOne({ _id: id });
    }

    async ensureClient(): Promise<MongoClient> {
        if (!this.client || !this.client.isConnected()) {
            this.client = await MongoClient.connect(url, options);
        }

        assert(this.client && this.client.isConnected(), 'Соединение установлено');

        return this.client;
    }

    async ensureCollection(): Promise<Collection<TData>> {
        const client = await this.ensureClient();

        const db = client.db(DB_NAME);
        const collection = db.collection<TData>(this.collectionName);

        return collection;
    }
}
