import { RepkaScreenBuilder } from '../RepkaScreenBuilder';
import { RepkaScreen } from '../RepkaScreen';

export function configureGreating(screen: RepkaScreenBuilder) {
    screen.withReply((reply) => {
        reply.withText(
            'Добрый вечер и добро пожаловать в игру "Угадай песню о войне".',
            'Прослушайте фрагмент и угадайте песню.',
            'Готовы начать игру?'
        );
    });

    screen.withInput((command, context, setState) => {
        return RepkaScreen.Quit;
    });
}
