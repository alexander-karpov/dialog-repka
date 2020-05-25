import { Predicate } from './Predicate';
import { Character } from './Character';
import { KnownCharId } from './KnownCharId';
import { MovementManner } from './MovementManner';

export interface KnownChar {
    id: KnownCharId
    hint: string;
    normal: string;
    trigger: Predicate<Character>;
    image?: string;
    movement: MovementManner;
    sounds: string[];
}
