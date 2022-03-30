export interface PersonReverserResult {
    reversed: string;
    tokens: [word: string, reversed: string, reversedTag: string, adj?: string][];
}
