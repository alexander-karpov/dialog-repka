import { Grammeme } from './Grammeme';

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
    inflect(normalForm: string, grs: Grammeme[]): Promise<string>;
}
