import { Stemmer } from './Stemmer';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { Token } from './tokens';

/**
 * Добавляет кэширование на файловую систему
 */
export class DumpingStemmer implements Stemmer {
    constructor(private readonly stemmer: Stemmer) {}

    async analyze(message: string): Promise<Token[]> {
        const dumpFileName = this.makeDumpFileName(message);
        const dumpPath = path.resolve('/tmp', dumpFileName);

        try {
            if (fs.existsSync(dumpPath)) {
                const content = fs.readFileSync(dumpPath).toString('utf8');
                return JSON.parse(content);
            }
        } catch (error) {
            console.error(`DumpingStemmer: не удалось прочитать файл дампа: ${error}.`);
        }

        const tokens = await this.stemmer.analyze(message);

        try {
            fs.writeFileSync(dumpPath, JSON.stringify(tokens));
        } catch (error) {
            console.error(`DumpingStemmer: не удалось сохранить файл дампа: ${error}.`);
        }

        return tokens;
    }

    private makeDumpFileName(message: string): string {
        const hash = crypto.createHash('md5').update(message, 'utf8').digest('hex');
        return `repka-stem-${hash}`;
    }
}
