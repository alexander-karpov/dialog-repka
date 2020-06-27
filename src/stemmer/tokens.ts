import { Predicate } from '../Predicate';
import { Gr } from './Gr';
import { Lexeme } from './Lexeme';
import { Token } from './Token';

export function isTokenAccept(lexeme: Lexeme, grs: Gr[]): boolean {
    return grs.every(gr => lexeme.tokenGrs.some(lgr => lgr.includes(gr)));
}

export function findLexemes(
    tokens: Token[],
    pattern: Predicate<Lexeme>[],
    offset = 0,
): Lexeme[] | undefined {
    if (!tokens.length || !pattern.length) {
        return undefined;
    }

    if (pattern.length + offset > tokens.length) {
        return undefined;
    }

    const result: Lexeme[] = [];

    for (let i = 0; i < pattern.length; i++) {
        const token = tokens[i + offset];
        const lexeme = token.lexemes.find(pattern[i]);

        if (!lexeme) {
            return findLexemes(tokens, pattern, offset + 1);
        }

        result.push(lexeme);
    }

    return result;
}
