import { ReplyText } from './ReplyText';

export interface ReplyBuilder {
    withText(...speech: ReplyText[]): ReplyBuilder;

    withTextPluralized: (
        number: number,
        one: ReplyText,
        some: ReplyText,
        many: ReplyText
    ) => ReplyBuilder;

    withTts(...tts: (string | number)[]): ReplyBuilder;
    withEndSession(): ReplyBuilder;
    withButton(params: string | { title: string; url: string }): ReplyBuilder;
    withImage(imageId: string): void;
    selectRandom<TItem>(fn: (item: TItem) => void, items: TItem[], number?: number): void;
    readonly buttonsCount: number;
}
