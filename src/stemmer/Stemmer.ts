import { Token } from "./Token";

export interface Stemmer {
    analyze(message: string): Promise<Token[]>;
}
