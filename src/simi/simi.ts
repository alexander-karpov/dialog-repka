import { Dialog } from '../DialogBuilder/Dialog2';
import { SimiState } from './SimiState';
import { SimiScene } from './SimiScene';
import { Category } from './Category';
import { DialogIntents } from '../DialogBuilder/DialogIntents';
import { CreatureName } from './CreatureName';
import { FeatureValue } from './FeatureValue';
import * as assert from 'assert';
import { Feature } from './Feature';
import { nameof } from '../nameof';
import { upperFirst } from '../upperFirst';
import { creatures } from './creatures/creatures';

export const simi = new Dialog<SimiState, SimiScene>({
    state() {
        return {
            askedCreature: 'волк',
            askedAndCreature: 'собака',
        };
    },
    scenes: {
        [SimiScene.Start]: {
            reply(reply) {
                reply.withText('Привет, ребята!');
            },
            onTransition() {
                return SimiScene.AskDifferences;
            },
        },
        [SimiScene.AskDifferences]: {
            reply(reply, state) {
                reply.withText(
                    `Чем ${state.askedCreature} отличается от ${state.askedAndCreature}?`
                );
            },
            unrecognized(reply, state) {
                reply.withText('Ничего не поняла.');
                reply.withText(
                    `Чем же ${state.askedCreature} отличается от ${state.askedAndCreature}?`
                );
            },
            onInput({ intents }, state, setState) {
                const recognizedFeatures = extractFeatures(state.askedCreature, intents);

                if (recognizedFeatures.length) {
                    setState({ playerGuess: recognizedFeatures });

                    return SimiScene.ReviewDifferencesGuess;
                }

                return; // Unrecognized
            },
        },
        [SimiScene.ReviewDifferencesGuess]: {
            reply(reply, state) {
                const guess = state.playerGuess;

                assert(
                    guess,
                    `В ${SimiScene.ReviewDifferencesGuess} поле ${nameof<SimiState>(
                        'playerGuess'
                    )} установлен.`
                );

                const askedCreature = creatures[state.askedCreature];
                const [askedGuess] = guess.filter((f) => f.creature === state.askedCreature);
                const [askedAndGuess] = guess.filter((f) => f.creature === state.askedAndCreature);

                /**
                 *  1. Среди догадок есть зверь, о котором мы спрашивали
                 *  1.1 И больше ничего
                 */

                if (askedGuess && guess.length === 1) {
                    if (askedCreature.isRelevant(askedGuess)) {
                        reply.withText(
                            `Да, ${state.askedCreature} действительно ${askedGuess.value}.`
                        );
                    } else {
                        reply.withText(
                            'Не',
                            ['слыхала', 'слых+ала'],
                            `я раньше, что ${state.askedCreature} ${askedGuess.value}.`
                        );
                    }

                    return;
                }


            },
            onTransition() {
                return SimiScene.AskDifferences;
            },
        },
    },
});

function isCategory(category: string): category is Category {
    return Category.hasOwnProperty(category);
}

function extractFeatures(askedCreature: CreatureName, intents: DialogIntents): Feature[] {
    const result: Feature[] = [];
    const featureSlots = intents['Feature']?.slots;

    if (!featureSlots) {
        return [];
    }

    const creature = <CreatureName>featureSlots['creature']?.value ?? askedCreature;
    const andCreature = <CreatureName | undefined>featureSlots['andCreature']?.value;

    /**
     * Слоты со значением признака называются так же как
     * соотв. им категория, только с маленькой буквы
     * @example color, voice
     */
    const [feature] = Object.entries(featureSlots)
        .map(([slotName, slot]) => ({ category: upperFirst(slotName), value: slot.value }))
        .filter(({ category }) => Category.hasOwnProperty(category))
        .map(
            ({ category, value }) => new Feature(creature, <Category>category, <FeatureValue>value)
        );

    if (feature) {
        result.push(feature);
    }

    if (andCreature) {
        /**
         * Слоты со значением признака "антипода" называются так же как
         * соотв. им категория, только с префиксом "and"
         * @example andColor, andVoice
         */
        const [andFeature] = Object.entries(featureSlots)
            .filter(([slotName]) => slotName.startsWith('and'))
            .map(([slotName, slot]) => ({
                category: slotName.substring('and'.length),
                value: slot.value,
            }))
            .filter(({ category }) => Category.hasOwnProperty(category))
            .map(
                ({ category, value }) =>
                    new Feature(andCreature, <Category>category, <FeatureValue>value)
            );

        if (andFeature) {
            result.push(andFeature);
        }
    }

    return result;
}

/*




                     reply.withText(
                    'Что-то я',
                    ['глуха', 'глух+а'],
                    'стала. Сядь ко мне на носик, да повтори ещё разок.'
                );


 */
