import { Stemmer } from './Stemmer';
import { Token } from './Token';
import { DumpService } from './DumpService';

/**
 * Добавляет кэширование на файловую систему
 */
export class DumpingStemmer implements Stemmer {
    private readonly dumpService: DumpService;

    constructor(private readonly stemmer: Stemmer) {
        this.dumpService = new DumpService(
            async (message) => JSON.stringify(await this.stemmer.analyze(message)),
            'repla-stemmer-'
        );
    }

    async analyze(message: string): Promise<Token[]> {
        return JSON.parse(await this.dumpService.get(message)) as Token[];
    }
}
