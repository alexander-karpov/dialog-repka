import { DialogBuilder } from '../DialogBuilder/DialogBuilder';
import { Stemmer } from '../stemmer/Stemmer';
import { DumpingStemmer } from '../stemmer/DumpingStemmer';
import { MystemStemmer } from '../stemmer/MystemStemmer';
import { Token } from "../stemmer/Token";
import { extractAttribute, extractCategory, extractVerb } from '../extractChar';
import { Category } from './Category';

enum SimiScene {
    EntryPoint = 'EntryPoint',
    Greating = 'Greating',
    Game = 'Game',
    KnownAttr = 'KnownAttr',
    DogKnownAttr = 'DogKnownAttr',
    UnknownAttr = 'UnknownAttr',
}

interface SimiState {
    wolfAttr?: Attribute;
    unknownAttr?: string;
    isWolf?: boolean
}

type Attribute = [Category, string];

const WOLF_ATTRS: Attribute[] = [
    [Category.Domestication, 'дикий'],
    [Category.Habitat, 'лес'],
    [Category.Temper, 'злой'],
    [Category.Color, 'серый'],
    [Category.Voice, 'выть'],
];

const DOG_ATTRS: Attribute[]  = [
    [Category.Domestication, 'домашний'],
    [Category.Habitat, 'дом'],
    [Category.Habitat, 'двор'],
    [Category.Temper, 'добрый'],
    [Category.Color, 'коричневый'],
    [Category.Color, 'чёрный'],
    [Category.Color, 'белый'],
    [Category.Voice, 'лаять'],
];

const dialogBuilder = new DialogBuilder<SimiState, SimiScene>();

const stemmer: Stemmer = new DumpingStemmer(new MystemStemmer());

dialogBuilder.addScenes({
    [SimiScene.EntryPoint]: {
        onInput() {
            return SimiScene.Greating;
        },
    },
    [SimiScene.Greating]: {
        reply(reply) {
            reply.withText('Привет, ребята! Давайте поиграем.');
        },
        onTransition() {
            return SimiScene.Game;
        },
    },
    [SimiScene.Game]: {
        reply(reply, state) {
            if (state.wolfAttr || state.unknownAttr) {
                reply.withText('А чем ещё волк отличается от собаки?');
            } else {
                reply.withText('Чем волк отличается от собаки?');
            }
        },
        unrecognized(reply) {
            reply.withText(
                'Что-то я',
                ['глуха', 'глух+а'],
                'стала. Сядь ко мне на носик, да повтори ещё разок.'
            );

            reply.withText('Чем волк отличается от собаки?');
        },
        async onInput({ command }, state, setState) {
            const isLes = command.includes(' лес');

            const tokens = await stemmer.analyze(command);
            const attr = extractAttribute(tokens);
            const verd = extractVerb(tokens);

            const wolfAttr = WOLF_ATTRS.find((pair) => pair[1] === attr || pair[1] === verd || (isLes && pair[1] ==='лес'));
            setState({ wolfAttr });
            setState({ isWolf: command.includes('волк')});

            if (wolfAttr && command.includes('волк')) {
                return SimiScene.KnownAttr;
            }

            const dogAttrs = DOG_ATTRS.find((pair) => pair[1] === attr || pair[1] === verd);

            if (dogAttrs && command.includes('собак')) {
                setState({ wolfAttr: dogAttrs });
                return SimiScene.DogKnownAttr;
            }

            setState({ unknownAttr: verd ? `может ${verd}` : attr });
            return SimiScene.UnknownAttr;
        },
    },
    [SimiScene.KnownAttr]: {
        reply(reply, { wolfAttr }) {
            if (!wolfAttr) return;
            const cat = wolfAttr[0];
            const val = wolfAttr[1];

            const dogValues = DOG_ATTRS.filter((attr) => attr[0] === cat).map((attr) => attr[1]);

            reply.withText('Да.');

            if (cat === Category.Temper) {
                reply.withText(`Волк ${val},`);
                reply.withText(`а собака`, ['–', '- - -'], `зверь ${dogValues.join(' и ')}.`);
            }

            if (cat === Category.Habitat) {
                reply.withText(`Волк живёт в таких местах, как ${val},`);
                reply.withText(`а собака в таких, как ${dogValues.join(' и ')}.`);
            }

            if (cat === Category.Domestication) {
                reply.withText(`Волк`, ['–', '- - -'], `зверь ${val},`);
                reply.withText(`а собака`, ['–', '- - -'], `${dogValues.join(' и ')}.`);
            }

            if (cat === Category.Color) {
                reply.withText(`У волка шерсть имеет ${val} цвет,`);
                reply.withText(`а у собаки`, ['–', '- - -'], `${dogValues.join(' и ')}.`);
            }

            if (cat === Category.Voice) {
                reply.withText(`Волки умеют ${val},`);
                reply.withText(`а собаки`, ['–', '- - -'], `${dogValues.join(' и ')}.`);
            }
        },
        onTransition() {
            return SimiScene.Game;
        },
    },
    [SimiScene.DogKnownAttr]: {
        reply(reply, { wolfAttr }) {
            if (!wolfAttr) return;
            const cat = wolfAttr[0];
            const val = wolfAttr[1];

            const wolfAttrs = WOLF_ATTRS.filter((attr) => attr[0] === cat).map((attr) => attr[1]);

            reply.withText('Да.');

            if (cat === Category.Temper) {
                reply.withText(`Собака – зверь ${val},`);
                reply.withText(`а волк`, ['–', '- - -'], `${wolfAttrs.join(' и ')}.`);
            }

            if (cat === Category.Habitat) {
                reply.withText(`Собака живёт в таких местах, как ${val},`);
                reply.withText(`а волк в таких, как ${wolfAttrs.join(' и ')}.`);
            }

            if (cat === Category.Domestication) {
                reply.withText(`Собака`, ['–', '- - -'], `зверь ${val},`);
                reply.withText(`а волк`, ['–', '- - -'], `${wolfAttrs.join(' и ')}.`);
            }

            if (cat === Category.Color) {
                reply.withText(`У собаки шерсть имеет ${val} цвет,`);
                reply.withText(`а у волка`, ['–', '- - -'], `${wolfAttrs.join(' и ')}.`);
            }

            if (cat === Category.Voice) {
                reply.withText(`Собаки умеют ${val},`);
                reply.withText(`а волки`, ['–', '- - -'], `${wolfAttrs.join(' и ')}.`);
            }
        },
        onTransition() {
            return SimiScene.Game;
        },
    },
    [SimiScene.UnknownAttr]: {
        reply(reply, state) {
            if (!state.unknownAttr) {
                return;
            }

            reply.withText(
                'Не',
                ['слыхала', 'слых+ала'],
                'я раньше, что',
                state.isWolf ? 'волк' : 'собака',
                state.unknownAttr,
                '.'
            );
        },
        onTransition() {
            return SimiScene.Game;
        },
    },
});

export const simi = dialogBuilder.build(SimiScene.EntryPoint, {});

/*

    const colors = [
        'красный', 'оранжевый', 'желтый', 'зеленый', 'голубой', 'синий', 'фиолетовый',
        'белый', 'серый', 'бурый', 'коричневый', 'чёрный'
    ];

 */
