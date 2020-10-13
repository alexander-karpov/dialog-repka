import { Gr } from './Gr';
import { Lexeme } from './Lexeme';
//#endregion

export function isLexemeAccept(lexeme: Lexeme, grs: Gr[]): boolean {
    return grs.every(gr => lexeme.gr.includes(gr));
}
