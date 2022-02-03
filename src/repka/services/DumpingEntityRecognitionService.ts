import { DumpService } from '../../DumpService';
import { EntityRecognitionResult } from '../interfaces/EntityRecognitionResult';
import { EntityRecognitionService } from '../interfaces/EntityRecognitionService';

export class DumpingEntityRecognitionService implements EntityRecognitionService {
    private readonly dumpService: DumpService<EntityRecognitionResult[]>;

    constructor(private readonly entityRecognitionService: EntityRecognitionService) {
        this.dumpService = new DumpService('repka-entity-rec-');
    }

    recognize(text: string): Promise<EntityRecognitionResult[]> {
        return this.dumpService.get(text, () => this.entityRecognitionService.recognize(text));
    }
}
