import { Character } from './Character';
import { isTokenAccept, findLexemes } from './stemmer/tokens';
import { isLexemeAccept } from './stemmer/isLexemeAccept';
import { findLexeme } from './stemmer/findLexeme';
import { Token } from './stemmer/Token';
import { Lexeme } from './stemmer/Lexeme';
import { Gr } from './stemmer/Gr';
import { Predicate } from './Predicate';
import { last } from './last';
import { Gender } from './Gender';
import { Word } from './Word';
import { CharacterType } from './CharacterType';
import { Morpher } from './Morpher';

/**
 * Mystem возвращает бесконтекстную вероятность леммы.
 * Используем её для отсечения совсем невероятных,
 * но мешающих распознаванию вариантов.
 */
const LEXEME_PROBABILITY_BARRIER = 0.0001;

// #region Gr patterns
const Probably = (l: Lexeme) => l.weight >= 0.021;
const S = (l: Lexeme) => isLexemeAccept(l, [Gr.S]);
const A = (l: Lexeme) => isLexemeAccept(l, [Gr.A]);
const V = (l: Lexeme) => isLexemeAccept(l, [Gr.V]);
const Acc = (l: Lexeme) => isLexemeAccept(l, [Gr.Acc]);
const Nom = (l: Lexeme) => isLexemeAccept(l, [Gr.Nom]);
const Anim = (l: Lexeme) => isLexemeAccept(l, [Gr.anim]);
const Single = (l: Lexeme) => isLexemeAccept(l, [Gr.single]);
const Persn = (l: Lexeme) => isLexemeAccept(l, [Gr.persn]);
const Famn = (l: Lexeme) => isLexemeAccept(l, [Gr.famn]);
const Male = (l: Lexeme) => isLexemeAccept(l, [Gr.Male]);
const Famela = (l: Lexeme) => isLexemeAccept(l, [Gr.Famela]);
const Unisex = (l: Lexeme) => isLexemeAccept(l, [Gr.Unisex]);
const NotTokenA = (l: Lexeme) => !isTokenAccept(l, [Gr.A]);
const NotName = (l: Lexeme) => !isLexemeAccept(l, [Gr.persn]) && !isLexemeAccept(l, [Gr.famn]);

function x(...ps: Predicate<Lexeme>[]): Predicate<Lexeme> {
    return (l: Lexeme) => ps.every((p) => p(l));
}

const subjectPatterns: Predicate<Lexeme>[][] = [
    // Имена вин.
    [x(Persn, Acc, Male), x(Famn, Acc)],
    [x(Persn, Acc, Famela, Single), x(Famn, Acc)],
    [x(Persn, Acc, Unisex), x(Famn, Acc)],
    // Вин.
    [x(S, Anim, Single, Acc, NotTokenA), x(S, Acc)],
    [x(S, Anim, Single, Acc, NotTokenA, NotName, Probably)],
    // Имена имен.
    [x(Persn, Nom, Male), x(Famn, Nom)],
    [x(Persn, Nom, Famela), x(Famn, Nom)],
    [x(Persn, Nom, Unisex), x(Famn, Nom)],
    // Имен имен.
    [x(S, Anim, Nom, NotTokenA), x(S, Nom, NotTokenA)],
    // Фамилия вин
    [x(Famn, Acc)],
    // Имен
    [x(S, Anim, Nom, NotTokenA)],
    // Что угодно
    [x(S, Anim, Single)],
    [x(S, Anim)],
];
// #endregion

export function extractСreature(tokens: Token[]): Character | undefined {
    const fixdedTokens = fixTokens(tokens);
    const subject = extractSubject(fixdedTokens);

    if (!subject) {
        return undefined;
    }

    const predicates = extractPredicates(subject, fixdedTokens);
    const subjectFirst = subject[0] as Lexeme;

    const word: Word = {
        nominative: predicates
            .map((p) => AToCnsistent(p, subjectFirst).nominative)
            .concat(subject.map((s) => s.lex))
            .join(' '),
        accusative: predicates
            .map((p) => AToCnsistent(p, subjectFirst).accusative)
            .concat(subject.map((l) => SToAccCnsistent(l, subjectFirst)))
            .join(' '),
    };

    return new Character(
        CharacterType.Сreature,
        word,
        extractGender(subjectFirst),
        subject[0].lex,
        fixTts(word)
    );
}

export function extractSubject(tokens: Token[]): Lexeme[] | undefined {
    for (let pattern of subjectPatterns) {
        const matches = findLexemes(tokens, pattern);

        if (matches) {
            return matches;
        }
    }

    return undefined;
}

function extractPredicates(subject: Lexeme[], tokens: Token[]): Lexeme[] {
    const reversed = tokens.slice(0, subject[0].position);
    reversed.reverse();
    const predicates: Lexeme[] = [];

    for (let token of reversed) {
        const a = findLexeme(token, [Gr.A]);

        if (a) {
            predicates.unshift(a);
        } else {
            break;
        }
    }

    return predicates;
}

function AToCnsistent(lexeme: Lexeme, consistentWith: Lexeme): Word {
    const isFamela = isLexemeAccept(consistentWith, [Gr.Famela]);

    if (isFamela) {
        return {
            nominative: AToNomFamela2(lexeme.lex),
            accusative: AToAccFamela2(lexeme.lex),
        };
    }

    return {
        nominative: lexeme.lex,
        accusative: AToAccMale(lexeme.lex),
    };
}

/**
 * Меняет род прилагательного с муж. на жен.
 * @param lexeme
 */
function AToNomFamela2(lex: string) {
    const endsWith = (end: string) => lex.endsWith(end);
    const changeTwo = (end: string) => `${lex.substring(0, lex.length - 2)}${end}`;
    const changeThree = (end: string) => `${lex.substring(0, lex.length - 3)}${end}`;

    if (endsWith('кий')) {
        return changeThree('кая');
    }

    if (endsWith('ний')) {
        return changeThree('няя');
    }

    if (endsWith('ий')) {
        return changeTwo('яя');
    }

    if (endsWith('ый')) {
        return changeTwo('ая');
    }

    if (endsWith('ой')) {
        return changeTwo('ая');
    }

    return lex;
}

/**
 * Меняет род прилагательного с муж. на жен.
 * @param lexeme
 */
function AToAccFamela2(lex: string) {
    const endsWith = (end: string) => lex.endsWith(end);
    const changeTwo = (end: string) => `${lex.substring(0, lex.length - 2)}${end}`;
    const changeThree = (end: string) => `${lex.substring(0, lex.length - 3)}${end}`;

    if (endsWith('ний')) {
        return changeThree('нюю');
    }

    if (endsWith('ий')) {
        return changeTwo('ую');
    }

    if (endsWith('ый')) {
        return changeTwo('ую');
    }

    if (endsWith('ой')) {
        return changeTwo('ую');
    }

    return lex;
}

function AToAccMale(lex: string) {
    const endsWith = (end: string) => lex.endsWith(end);
    const changeTwo = (end: string) => `${lex.substring(0, lex.length - 2)}${end}`;

    if (endsWith('кий')) {
        return changeTwo('ого');
    }

    if (endsWith('ий') || endsWith('ие')) {
        return changeTwo('его');
    }

    if (endsWith('ый') || endsWith('ой') || endsWith('ые')) {
        return changeTwo('ого');
    }

    if (endsWith('ая')) {
        return changeTwo('ую');
    }

    if (endsWith('яя')) {
        return changeTwo('юю');
    }

    return lex;
}

function SToAccCnsistent(lexeme: Lexeme, consistentWith: Lexeme): string {
    const isMaleFamela = isLexemeAccept(lexeme, [Gr.Unisex]);
    const isFamela = isLexemeAccept(consistentWith, [Gr.Famela]);
    const isMale = isLexemeAccept(consistentWith, [Gr.Male]);
    const isNeuter = isLexemeAccept(consistentWith, [Gr.Neuter]);

    // Чудище -> чудище
    if (isNeuter) {
        return lexeme.lex;
    }

    if (isMaleFamela) {
        return Morpher.animMascFemnNomnToAccs(lexeme.lex);
    }

    if (isMale) {
        return Morpher.animMascNomnToAccs(lexeme.lex);
    }

    if (isFamela) {
        return Morpher.animFemnNomnToAccs(lexeme.lex);
    }

    return lexeme.lex;
}

function extractGender(lexeme: Lexeme): Gender {
    if (lexeme.gr.includes(Gr.Male)) {
        return Gender.Male;
    }

    if (lexeme.gr.includes(Gr.Unisex)) {
        return Gender.Unisex;
    }

    if (lexeme.gr.includes(Gr.Famela)) {
        return Gender.Famela;
    }

    return Gender.Neuter;
}

export function extractThing(tokens: Token[]): Character | undefined {
    const fixdedTokens = fixTokens(tokens);

    const SInanAcc = (l: Lexeme) => isLexemeAccept(l, [Gr.inan, Gr.S, Gr.Acc]);
    const SInanNom = (l: Lexeme) => isLexemeAccept(l, [Gr.inan, Gr.S, Gr.Nom]);

    const found = findLexemes(fixdedTokens, [SInanAcc]) || findLexemes(fixdedTokens, [SInanNom]);

    if (found) {
        const [char] = found;
        const isFamela = isLexemeAccept(char, [Gr.Famela]);

        return new Character(
            CharacterType.Thing,
            {
                nominative: char.lex,
                accusative: isFamela ? Morpher.animFemnNomnToAccs(char.lex) : char.lex,
            },
            extractGender(char),
            char.lex
        );
    }

    return undefined;
}

/**
 * Перед распознаванием нужно удалить
 * «вредные» слова.
 */
function fixTokens(tokens: Token[]): Token[] {
    // «Нет» распознаётся как неод.существительное
    const withouutNo = tokens.filter((t) => t.text !== 'нет');

    // Отбросить маловероятные (вообще невероятные) слова
    const moreLikely = withouutNo.map((t) => ({
        text: t.text,
        lexemes: t.lexemes.filter((l) => l.weight > LEXEME_PROBABILITY_BARRIER),
    }));

    // «Жучка» распознаётся как «жучок»
    const fixedJuchra = moreLikely.map((t) => {
        if (t.text === 'жучка') {
            return {
                text: t.text,
                lexemes: t.lexemes.filter((l) => l.lex !== 'жучок'),
            };
        }

        return t;
    });

    // Удаляет повторения
    const deduplicated: Token[] = [];

    for (let token of fixedJuchra) {
        const prev = last(deduplicated);

        if (!prev || prev.text !== token.text) {
            deduplicated.push(token);
        }
    }

    /**
     * Удаляем краткие формы.
     * Чтобы слово «пришла» не распознавалось как «пришлая»
     */
    const noBriefForm = deduplicated.map((t) => ({
        text: t.text,
        lexemes: t.lexemes.filter((l) => !isLexemeAccept(l, [Gr.brev])),
    }));

    return noBriefForm;
}

/**
 * Исправляет произношение для некоторых персонажей
 * @param char
 */
function fixTts(word: Word): Word {
    if (word.nominative === 'жучка') {
        return {
            nominative: 'ж+учка',
            accusative: 'ж+учку',
        };
    }

    return word;
}
