export type SalutRequest = {
    messageName: string;
    sessionId: string;
    messageId: number;
    uuid: {
        userChannel: string;
        sub: string;
        userId: string;
    };
    payload: {
        device: unknown;
        app_info: {
            projectId:string;
            applicationId: string;
            appversionId: string;
        };
        character: unknown;
        intent: string;
        original_intent: string;
        intent_meta: unknown;
        projectName: string;
        annotations: unknown;
        strategies: unknown;
        new_session: boolean;
        message: {
            original_text: string;
            normalized_text: string;
            asr_normalized_message: string;
            entities: unknown;
            tokenized_elements_list: unknown;
        };
    };
};
