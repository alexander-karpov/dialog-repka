import { DialogRequest } from '../src/DialogBuilder/DialogRequest';
export function createDialogRequestStub<TDialogContext>(command: string): DialogRequest<TDialogContext> {
    return {
        meta: {
            locale: 'ru-RU',
            timezone: 'Europe/Moscow',
        },
        request: {
            command: command,
            original_utterance: command,
            markup: {
                dangerous_context: false
            },
            nlu: {
                tokens: command.split(' ')
            }
        },
        state: {
            session: {},
        },
        session: {
            new: false,
            message_id: 1,
            session_id: '2eac4854-fce721f3-b845abba-20d60',
            skill_id: '3ad36498-f5rd-4079-a14b-788652932056',
            application: {
                application_id:'AC9WC3DF6FCE052E45A4566A48E6B7193774B84814CE49A922E163B8B29881DC'
            }
        },
        version: '1.0'
    };
}
