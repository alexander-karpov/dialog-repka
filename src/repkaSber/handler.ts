import { DialogsRequest } from '../DialogBuilder2/DialogsRequest';
import { DialogsResponse } from '../DialogBuilder2/DialogsResponse';
import { SalutRequest } from './SalutRequest';
import { SalutResponse } from './SalutResponse';
import { handler as repkaHandler } from './../repka/handler';
import { MongoDbCollection } from './../MongoDbCollection';

const repkaSessions = new MongoDbCollection('repkaSessions');

export const handler = async function (event: { body: string }) {
    const request:SalutRequest = <SalutRequest>JSON.parse(event.body);
    const response: SalutResponse = responseAliceToSalut(
        await repkaHandler(await requestSalutToAlice(request)),
        request
    );

    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json',
        },
        isBase64Encoded: false,
        body: JSON.stringify(response),
    };
};

async function requestSalutToAlice(request: SalutRequest): Promise<DialogsRequest> {
    const state = (await repkaSessions.find(request.sessionId)) || {};

    return {
        session: {
            session_id: request.sessionId,
            message_id: request.messageId,
            skill_id: request.payload.app_info.projectId,
            new: request.payload.new_session,
            application: {
                application_id: request.uuid.userId,
            },
        },
        request: {
            command: request.payload.message.asr_normalized_message,
            original_utterance: request.payload.message.original_text,
            markup: {
                dangerous_context: false,
            },
            nlu: {
                tokens: [],
                intents: {},
            },
        },
        state: {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            session: state,
        },
        meta: {
            locale: 'ru-RU',
            timezone: 'Europe/Moscow',
        },
        version: '1.0',
    };
}

function responseAliceToSalut(response: DialogsResponse, request: SalutRequest): SalutResponse {
    void repkaSessions.save(request.sessionId, response.session_state);

    const buttons = response.response.buttons ?? [];

    return {
        messageName: 'ANSWER_TO_USER',
        sessionId: request.sessionId,
        messageId: request.messageId,
        uuid: request.uuid,
        payload: {
            auto_listening: !response.response.end_session,
            finished: response.response.end_session,
            pronounceText: response.response.text,
            device: request.payload.device,
            suggestions: {
                buttons: buttons.map(b => {
                    return {
                        title: b.title,
                        action: {
                            type: 'text',
                            text: b.title
                        }
                    }
                })
            }
        },
    };
}
