import { DumpService } from '../../DumpService';
import { PersonReverserResult } from '../interfaces/PersonReverserResult';
import { PersonReverserService } from '../interfaces/PersonReverserService';

export class DumpingPersonReverserService implements PersonReverserService {
    private readonly dumpService: DumpService<PersonReverserResult>;

    constructor(private readonly personReverserService: PersonReverserService) {
        this.dumpService = new DumpService('repka-reverse-person-');
    }

    reverse(text: string): Promise<PersonReverserResult> {
        return this.dumpService.get(text, () => this.personReverserService.reverse(text));
    }
}
