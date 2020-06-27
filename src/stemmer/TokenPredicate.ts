import { Token } from './Token';
import { Lexeme } from './Lexeme';
type TokenPredicate = (token: Token) => Lexeme | undefined;
