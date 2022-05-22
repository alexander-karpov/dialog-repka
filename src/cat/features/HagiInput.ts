import { Input } from '../../DialogBuilder2/Input';
import { Character } from '../../repka/Character';
import { PersonReverserResult } from '../../interfaces/PersonReverserResult';

export type HagiInput = Input & {
    reversedTokens: string[];
    character?: Character;
};
