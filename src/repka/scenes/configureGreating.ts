import { RepkaScene } from '../RepkaScene';
import { RepkaTransitionBuilder } from '../RepkaTransitionBuilder';

export function configureGreating(scene: RepkaTransitionBuilder) {
    scene.withReply((reply) => {
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

    scene.withTransition(() => {
        return RepkaScene.TaleBegin;
    });
}
