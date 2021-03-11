export type SalutResponse = {
    messageName: string;
    sessionId: string;
    messageId: number;
    uuid: {
        userChannel: string;
        sub: string;
        userId: string;
    };
    payload: {
        pronounceText: string;
        device: unknown;
        auto_listening: boolean;
        finished: boolean;
        suggestions: {
            buttons: {
                title: string;
                action: {
                    text: string;
                    type: 'text';
                };
            }[];
        };
    };
};
