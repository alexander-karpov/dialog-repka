import { CreatureName } from './CreatureName';
import { Feature } from './Feature';

export interface SimiState {
    askedCreature: CreatureName;
    askedAndCreature: CreatureName;
    playerGuess?: Feature[];
}
