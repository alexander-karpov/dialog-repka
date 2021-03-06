import { RepkaSceneName } from '../RepkaSceneName';
import { RepkaScene } from '../RepkaScene';
import { replyWithRepeatInvitation } from '../replies/replyWithRepeatInvitation';
import { sendEvent } from '../sendEvent';

const CONFIRM_WORDS = [
    'продолж',
    'давай',
    'ладно',
    'хочу',
    'хотим',
    'заново',
    'снова',
    'сначала',
    'еще',
    'игра',
    'сыгра',
    'дальше',
];

const REJECT_WORDS = ['достаточно', 'хватит', 'нет', 'конец', 'пока', 'не надо', 'не хо', 'стоп'];

export const TaleEnd: RepkaScene = {
    reply(reply) {
        reply.withText('Какая интересная сказка!');

        replyWithRepeatInvitation(reply);
    },

    unrecognized(reply) {
        reply.withText([
            'Сейчас я ожидаю в ответ "Да" или "Нет".',
            'сейчас я ожидаю в ответ - - да - - или  нет.',
        ]);

        replyWithRepeatInvitation(reply);

        sendEvent('UnrecognizedPlayAgain');
    },

    onInput(request) {
        if (
            request.isReject ||
            REJECT_WORDS.some((confirmWord) => request.command.includes(confirmWord))
        ) {
            return RepkaSceneName.Quit;
        }

        if (
            request.isConfirm ||
            CONFIRM_WORDS.some((confirmWord) => request.command.includes(confirmWord))
        ) {
            return RepkaSceneName.TaleBegin;
        }
    },
};
