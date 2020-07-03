import { Dialog } from '../DialogBuilder/Dialog2';
import { SimiState } from './SimiState';
import { SimiScene } from './SimiScene';
import { Category } from './Category';
import { DialogIntents } from '../DialogBuilder/DialogIntents';
import { FeatureIntent } from './FeatureIntent';
import { CreatureName } from './CreatureName';
import { Feature } from './Feature';
import * as assert from 'assert';
import { upperFirst } from '../upperFirst';

export const simi = new Dialog<SimiState, SimiScene>({
    state() {
        return {
            creature: 'собака',
            anticreature: 'волк',
        };
    },
    scenes: {
        [SimiScene.Start]: {
            reply(reply) {
                reply.withText('Привет, ребята!');
            },
            onTransition() {
                return SimiScene.AskAboutCreature;
            },
        },
        [SimiScene.AskAboutCreature]: {
            reply(reply) {
                reply.withText('Чем волк отличается от собаки?');
            },
            unrecognized(reply) {
                reply.withText('Ничего не поняла.');
                reply.withText('Чем волк отличается от собаки?');
            },
            onInput({ intents }, state, setState) {
                const rec = extractIntent(intents);

                if (!rec) {
                    return; // Unrecognized
                }

                setState({ guess: rec });

                return SimiScene.SayResult;
            },
        },
        [SimiScene.SayResult]: {
            reply(reply, state) {
                const guess = state.guess;

                assert(guess, `В сцене ${SimiScene.SayResult} guess уже установлен.`);

                if (!guess.creature || guess.creature === state.creature) {
                    reply.withText('Речь именно об этом.');
                    return;
                }

                reply.withText('Речь не об этом.');
            },
            onTransition() {
                return SimiScene.AskAboutCreature;
            },
        },
    },
});

function isCategory(category: string): category is Category {
    return Category.hasOwnProperty(name);
}

function extractIntent(intents: DialogIntents): FeatureIntent | undefined {
    for (const [name, value] of Object.entries(intents)) {
        if (isCategory(name)) {
            const creature = <CreatureName | undefined>value?.slots['creature']?.value;
            const feature = <Feature>value?.slots['feature']?.value;
            const anticreature = <CreatureName | undefined>value?.slots['antagonist']?.value;
            const antifeature = <Feature>(
                (<string | undefined>value?.slots['antagonistFeature']?.value)
            );

            return {
                category: name,
                creature,
                feature,
                anticreature,
                antifeature,
            };
        }
    }

    // Not found
    return undefined;
}

/*

export type Attribute = [Category, string];

const WOLF_ATTRS: Attribute[] = [
    [Category.Domestication, 'дикий'],
    [Category.Habitat, 'лес'],
    [Category.Temper, 'злой'],
    [Category.Color, 'серый'],
    [Category.Voice, 'выть'],
];

const DOG_ATTRS: Attribute[] = [
    [Category.Domestication, 'домашний'],
    [Category.Habitat, 'дом'],
    [Category.Habitat, 'двор'],
    [Category.Temper, 'добрый'],
    [Category.Color, 'коричневый'],
    [Category.Color, 'чёрный'],
    [Category.Color, 'белый'],
    [Category.Voice, 'лаять'],
];

       reply.withText(
                    'Не',
                    ['слыхала', 'слых+ала'],
                    'я раньше, что',
                    'волк' ,
                    'чихает',
                    '.'
                );

                     reply.withText(
                    'Что-то я',
                    ['глуха', 'глух+а'],
                    'стала. Сядь ко мне на носик, да повтори ещё разок.'
                );

                reply.withText('Чем волк отличается от собаки?');

 */
