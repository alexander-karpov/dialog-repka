import { ReplyText } from './ReplyText';

export interface ReplyBuilder {
    withText(...speech: ReplyText[]): void;

    withTextPluralized: (
        number: number,
        one: ReplyText,
        some: ReplyText,
        many: ReplyText
    ) => void;

    withTts(...tts: (string | number)[]): void;
    withEndSession(): void;
    withButton(params: string | { title: string; url: string }): void;
    withImage(imageId: string): void;
    selectRandom<TItem>(fn: (item: TItem) => void, items: TItem[], number?: number): void;
    readonly buttonsCount: number;
}
