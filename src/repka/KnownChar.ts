import { Predicate } from './Predicate';
import { Character } from './Character';
import { KnownCharId } from './KnownCharId';

export interface KnownChar {
    id: KnownCharId
    hint: string;
    normal: string;
    trigger: Predicate<Character>;
    image?: string;
    sounds: string[];
}
