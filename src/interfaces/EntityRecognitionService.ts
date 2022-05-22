import { EntityRecognitionResult } from './EntityRecognitionResult';

export interface EntityRecognitionService {
    recognize(text: string): Promise<EntityRecognitionResult[]>;
}
