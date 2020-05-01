export type TuneIntents = Partial<Record<IntentName, IntentsForm>>;

interface IntentsForm {
    slots: Record<string, Slot>
};

interface Slot {
    type: string;
    tokens: { start: number, end: number };
    value: string;
};

export enum IntentName {
    Confirm ='YANDEX.CONFIRM',
    Reject= 'YANDEX.REJECT',
    Help = 'YANDEX.HELP',
    Repeat = 'YANDEX.REPEAT',
    PositivePhrase = 'positive_phrase',
}
