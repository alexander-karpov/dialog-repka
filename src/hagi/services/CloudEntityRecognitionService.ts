import axios from 'axios';
import { EntityRecognitionResult } from '../interfaces/EntityRecognitionResult';
import { EntityRecognitionService } from '../interfaces/EntityRecognitionService';

export class CloudEntityRecognitionService implements EntityRecognitionService {
    async recognize(text: string): Promise<EntityRecognitionResult[]> {
        const textEncoded = encodeURIComponent(text);
        const callUrl = `https://functions.yandexcloud.net/d4eb6o9pa7vcip77pki1?text=${textEncoded}`;

        const response = await axios.get<EntityRecognitionResult[]>(callUrl);

        if (response.status !== 200) {
            throw new Error(`Падение распознания сущностей в тексте ${text}`);
        }

        return response.data;
    }
}
