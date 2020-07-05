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
                return SimiScene.AskAboutCreature;
            },
        },
        [SimiScene.AskAboutCreature]: {
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

                    return SimiScene.SayResult;
                }

                return; // Unrecognized
            },
        },
        [SimiScene.SayResult]: {
            reply(reply, state) {
                const guess = state.playerGuess;

                assert(
                    guess,
                    `В ${SimiScene.SayResult} поле ${nameof<SimiState>('playerGuess')} установлен.`
                );

                reply.withText('Да.');

                guess.forEach((feature, index) => {
                    if (index > 0) {
                        reply.withText('а');
                    }

                    reply.withText(`${feature.creature} правда ${feature.value}.`);
                });
            },
            onTransition() {
                return SimiScene.AskAboutCreature;
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
    andCreature
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


 */
