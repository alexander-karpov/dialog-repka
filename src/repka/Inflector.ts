import { Grammama } from './Grammama';

/**
 * Склоняет слова
 */
export interface Inflector {
    /**
     * Склоняет слово в указанную форму
     * @param normalForm Нормальная форма
     * @param grs Граммемы целевой формы
     * @returns Слово в заданной форме
     */
    inflect(normalForm: string, grs: Grammama[]): Promise<string>;
}
