import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';

/**
 * Помогает сохранять кэш на файловую систему
 */

export class DumpService {
    constructor(private readonly fileNamePrefix: string) {}

    async get(key: string, dataProvider: () => Promise<string>): Promise<string> {
        const dumpPath = this.makeDumpPath(key);
        const isDumpExists = await util.promisify(fs.exists)(dumpPath);

        if (isDumpExists) {
            try {
                const data = await util.promisify(fs.readFile)(dumpPath);

                return data.toString('utf8');
            } catch (error) {
                console.error(`Не удалось прочитать файл дампа: ${(error as Error).message}.`);
            }
        }

        const data = await dataProvider();

        util.promisify(fs.writeFile)(dumpPath, data).catch((error: Error) => {
            console.error(`Не удалось сохранить файл дампа: ${error.message}.`);
        });

        return data;
    }

    private makeDumpPath(key: string): string {
        /**
         * Нельзя использовать data в название файла как есть
         * т.к. на длину имени файла есть ограничение.
         */
        const uniqueName = key.length <= 32 ? encodeURIComponent(key) : this.makeHash(key);

        return path.resolve('/tmp', `${this.fileNamePrefix}-${uniqueName}`);
    }

    makeHash(key: string): string {
        let hash = 0;

        for (const byte of Buffer.from(key, 'utf8')) {
            hash ^= (hash << 5) + (hash >>> 2) + byte;
        }
        hash &= 1048575; // битовая маска 32^4-1

        return hash.toString();
    }
}
