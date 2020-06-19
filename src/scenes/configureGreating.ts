import { RepkaSceneBuilder } from '../RepkaSceneBuilder';
import { RepkaScene } from '../RepkaScene';

export function configureGreating(scene: RepkaSceneBuilder) {
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
