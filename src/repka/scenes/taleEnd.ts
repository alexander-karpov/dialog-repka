import { RepkaSceneName } from '../RepkaSceneName';
import { RepkaScene } from '../RepkaScene';
import { replyWithRepeatInvitation } from '../replies/replyWithRepeatInvitation';

const CONFIRM_WORDS = [
    'продолжай',
    'давай',
    'ладно',
    'хочу',
    'хочим',
    'заново',
    'снова',
    'сначала',
];

const REJECT_WORDS = ['достаточно', 'хватит', 'нет', 'конец', 'пока', 'не надо'];

export const TaleEnd: RepkaScene = {
    reply(reply) {
        reply.withText('Какая интересная сказка!');

        replyWithRepeatInvitation(reply);
    },

    unrecognized(reply)  {
        reply.withText([
            'Сейчас я ожидаю в ответ "Да" или "Нет".',
            'сейчас я ожидаю в ответ - - да - - или  нет.',
        ]);

        replyWithRepeatInvitation(reply);
    },

    onInput(request)  {
        if (
            request.isConfirm ||
            CONFIRM_WORDS.some((confirmWord) => request.command.includes(confirmWord))
        ) {
            return RepkaSceneName.TaleBegin;
        }

        if (
            request.isReject ||
            REJECT_WORDS.some((confirmWord) => request.command.includes(confirmWord))
        ) {
            return RepkaSceneName.Quit;
        }
    }

}
