import { Gr } from './Gr';
//#region types

export type Lexeme = {
    lex: string;
    weight: number;
    gr: Gr[];
    tokenGrs: Gr[][];
    position: number;
};
