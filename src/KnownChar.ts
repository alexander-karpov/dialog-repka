import { Predicate } from './Predicate';
import { Character } from './Character';
import { KnownCharId } from './KnownCharId';

export interface KnownChar {
    id: KnownCharId
    title: string;
    normal: string;
    trigger: Predicate<Character>;
    image: string;
}
