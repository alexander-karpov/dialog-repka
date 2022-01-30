/**
 * Значение какой-либо грамматической характеристики слова.
 * Например, “множественное число” или “деепричастие”.
 * @see https://pymorphy2.readthedocs.io/en/stable/user/grammemes.html#grammeme-docs
 */
export enum Grammeme {
    Masc = 'masc',
    Femn = 'femn',
    Neut = 'neut',
    // common gender
    Msf = 'ms-f',
    Sing = 'sing',
    Nomn = 'nomn',
    Accs = 'accs',
    Inan = 'inan',
    Anim = 'anim',
}
