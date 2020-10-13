import { Character } from './Character';
import { KnownCharId } from './KnownCharId';

/**
 * Что мы хотем помнить о пользователе
 * в процессе игры и между играми
 */
export interface RepkaState {
    /**
     * В списке всегда присутствует хотя бы один персонаж - Дедка.
     * Так что упрощаем себе жизнь и делаем тип [Character].
     */
    characters: [Character];
    /**
     * Известные персонажи, которых пользователь уже видел
     */
    seenKnownChars: KnownCharId[],

    /**
     * Это может быть недопустимый персонаж, поэтому
     * он не всегда равен last(characters)
     */
    lastCalledChar: Character

    /**
     * Предыдущий персонаж
     */
    previousChar: Character
}
