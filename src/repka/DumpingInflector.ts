import { Grammama } from './Grammama';
import { Inflector } from './Inflector';
import { DumpService } from '../DumpService';


export class DumpingInflector implements Inflector {
    private readonly dumpService: DumpService;

    constructor(private readonly inflector: Inflector) {
        this.dumpService = new DumpService('repka-inflector-');
    }

    async inflect(normalForm: string, grs: Grammama[]): Promise<string> {
        const dumpKey = this.makeDumpKey(normalForm, grs);

        return this.dumpService.get(dumpKey, () => this.inflector.inflect(normalForm, grs));
    }

    private makeDumpKey(normalForm: string, grs: Grammama[]): string {
        return `${normalForm}-${grs.join('-')}`;
    }
}
