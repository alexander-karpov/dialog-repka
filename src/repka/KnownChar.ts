import { Action2 } from '../Action';
import { ReplyBuilder } from '../DialogBuilder2';
import { Predicate } from '../Predicate';
import { Character } from './Character';
import { KnownCharId } from './KnownCharId';
import { RepkaModel } from './RepkaModel';

export interface KnownChar {
    id: KnownCharId;
    hint: string;
    normal: string;
    trigger: Predicate<Character>;
    image?: string;
    sounds: string[];
    /**
     * Не выводит подсказки для этих персонажей
     */
    isHidden?: boolean;
    phrase?: Action2<ReplyBuilder, RepkaModel>;
}
