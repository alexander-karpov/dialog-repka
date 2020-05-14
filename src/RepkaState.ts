import { Character } from './Character';

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
}
