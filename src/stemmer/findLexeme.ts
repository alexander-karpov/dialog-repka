import { Token } from './Token';
import { Gr } from './Gr';
import { isLexemeAccept } from './isLexemeAccept';

export function findLexeme(token: Token, grs: Gr[]) {
    return token.lexemes.find((l) => isLexemeAccept(l, grs));
}
