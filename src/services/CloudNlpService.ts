import axios from 'axios';
import { NlpResult } from '../interfaces/NlpResult';
import { NlpService } from '../interfaces/NlpService';

export class CloudNlpService implements NlpService {
    async process(text: string): Promise<NlpResult> {
        const response = await axios.post<NlpResult>('http://51.250.0.245:5000/', { text });

        if (response.status !== 200) {
            throw new Error(`Падение запроса к nlp ${text}`);
        }

        return response.data;
    }
}
