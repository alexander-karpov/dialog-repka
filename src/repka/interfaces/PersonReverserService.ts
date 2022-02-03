import { PersonReverserResult } from './PersonReverserResult';

export interface PersonReverserService {
    reverse(text: string): Promise<PersonReverserResult>;
}
