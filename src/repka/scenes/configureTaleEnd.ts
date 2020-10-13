import { RepkaSceneBuilder } from '../RepkaSceneBuilder';
import { RepkaScene } from '../RepkaScene';
import { ReplyBuilder } from '../../DialogBuilder/ReplyBuilder';

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

export function configureTaleEnd(scene: RepkaSceneBuilder) {
    scene.withReply((reply) => {
        reply.withText('Какая интересная сказка!');

        replyWithRepeatInvitation(reply);
    });

    scene.withUnrecognized((reply) => {
        reply.withText([
            'Сейчас я ожидаю в ответ "Да" или "Нет".',
            'сейчас я ожидаю в ответ - - да - - или  нет.',
        ]);

        replyWithRepeatInvitation(reply);
    });

    scene.withInput((input) => {
        if (
            input.isConfirm ||
            CONFIRM_WORDS.some((confirmWord) => input.command.includes(confirmWord))
        ) {
            return RepkaScene.TaleBegin;
        }

        if (
            input.isReject ||
            REJECT_WORDS.some((confirmWord) => input.command.includes(confirmWord))
        ) {
            return RepkaScene.Quit;
        }
    });

    function replyWithRepeatInvitation(reply: ReplyBuilder) {
        reply.withTts('- -');
        reply.withText('Хотите сыграть', ['ещё раз?', 'ещ+ёраз?']);

        reply.withButton('Да');
        reply.withButton('Нет');
        reply.withButton({
            title: '❤️ Поставить оценку',
            url: 'https://dialogs.yandex.ru/store/skills/916a8380-skazka-pro-repku',
        });
    }
}
