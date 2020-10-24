import { Stemmer } from './Stemmer';
import { Token } from './Token';
import { DumpService } from '../../DumpService';

/**
 * Добавляет кэширование на файловую систему
 */
export class DumpingStemmer implements Stemmer {
    private readonly dumpService: DumpService;

    constructor(private readonly stemmer: Stemmer) {
        this.dumpService = new DumpService('repka-stemmer-');
    }

    async analyze(message: string): Promise<Token[]> {
        const data = await this.dumpService.get(message, async () =>
            JSON.stringify(await this.stemmer.analyze(message))
        );

        return JSON.parse(data) as Token[];
    }
}
