import { ReplyBuilder } from '../../DialogBuilder2';

export function replyWithRepeatInvitation(reply: ReplyBuilder): void {
    reply.withTts('- -');
    reply.withText('Хотите сыграть', ['ещё раз?', 'ещ+ёраз?']);

    reply.withButton('Да');
    reply.withButton('Нет');
    reply.withButton({
        title: '❤️ Поставить оценку',
        url: 'https://dialogs.yandex.ru/store/skills/916a8380-skazka-pro-repku',
    });
}
