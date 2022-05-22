import { NlpResult } from './NlpResult';

export interface NlpService {
    process(text: string): Promise<NlpResult>;
}
