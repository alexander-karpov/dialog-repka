import { RepkaScreenBuilder } from '../RepkaScreenBuilder';
import { RepkaScreen } from '../RepkaScreen';
import { Character } from '../Character';

export function configureTaleEnd(screen: RepkaScreenBuilder) {
    screen.withReply((reply) => {
        reply.withText('Какая интересная сказка! Хотите продолжить игру?');

        reply.withButton('Да');
        reply.withButton('Нет');
        reply.withButton({
            title: '❤️ Поставить оценку',
            url: 'https://dialogs.yandex.ru/store/skills/916a8380-skazka-pro-repku',
        });
    });

    screen.withUnrecognized((reply) => {
        reply.withText(
            [
                'Сейчас я ожидаю в ответ "Да" или "Нет".',
                'сейчас я ожидаю в ответ - - да - - или  нет.',
            ],
            'Хотите продолжить игру?'
        );
    });

    screen.withInput((input) => {
        if (input.isConfirm) {
            return RepkaScreen.TaleBegin;
        }

        if (input.isReject) {
            return RepkaScreen.Quit;
        }
    });
}
