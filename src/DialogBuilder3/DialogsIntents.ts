export interface DialogsIntents {
    [intentName: string]: {
        slots: {
            [intentName: string]: {
                type: string;
                tokens: {
                    start: number;
                    end: number;
                };
                value: string;
            };
        };
    };
}

export type DialogsEntity = {
    type: 'YANDEX.FIO';
    value: {
        first_name?: string;
        last_name?: string;
    };
};
