import axios from 'axios';
import { PersonReverserResult } from '../interfaces/PersonReverserResult';
import { PersonReverserService } from '../interfaces/PersonReverserService';

export class CloudPersonReverserService implements PersonReverserService {
    async reverse(text: string): Promise<PersonReverserResult> {
        const textEncoded = encodeURIComponent(text);
        const callUrl = `https://functions.yandexcloud.net/d4es2dkugjnp4c8hnb7j?text=${textEncoded}`;

        const response = await axios.get<PersonReverserResult>(callUrl);

        if (response.status !== 200) {
            throw new Error(`Падение смены лица в тексте ${text}`);
        }

        return response.data;
    }
}
