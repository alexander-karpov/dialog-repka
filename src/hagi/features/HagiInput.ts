import { Input } from '../../DialogBuilder2/Input';
import { Character } from '../../repka/Character';
import { PersonReverserResult } from '../../repka/interfaces/PersonReverserResult';

export type HagiInput = Input & {
    reversedTokens: PersonReverserResult['tokens'];
    character?: Character;
};
