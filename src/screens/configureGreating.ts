import { RepkaScreenBuilder } from '../RepkaScreenBuilder';
import { RepkaScreen } from '../RepkaScreen';

export function configureGreating(screen: RepkaScreenBuilder) {
    screen.withReply((reply) => {
        reply.withText(
            ['Привет, ребята!', 'Привет - ребята! - '],
            [`Хотите вместе сочинить сказку?`, `Хотите - - вместе - сочинить сказку? - - `],
            [`Вы слышали как посадил дед репку?`, `Вы слышали - как посадил дед репку? - - `],
            'А кто помогал её тянуть?',
            ['', ' - - '],
            'Давайте придумаем вместе.',
            ['', ' - - - '],
        );
    });

    screen.withTransition(() => {
        return RepkaScreen.BeginOfTale;
    });
}
