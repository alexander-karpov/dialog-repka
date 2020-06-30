import { Dialog } from '../DialogBuilder/Dialog2';
import { SimiState } from './SimiState';
import { SimiScene } from './SimiScene';

export const simi = new Dialog<SimiState, SimiScene>({
    startScene: 'EntryPoint',
    state() {
        return {};
    },
    whatCanYouDo(reply) {
        reply.withText('Поиграем?');
    },
    scenes: {
        EntryPoint: {
            onInput() {
                return 'Greating';
            },
        },
        Greating: {
            reply(reply) {
                reply.withText('Привет, ребята! Давайте поиграем.');
            },
            onTransition() {
                return 'Game';
            },
        },
        Game: {
            reply(reply, state) {
                // if (state.wolfAttr || state.unknownAttr) {
                //     reply.withText('А чем ещё волк отличается от собаки?');
                // } else {
                //     reply.withText('Чем волк отличается от собаки?');
                // }
            },
            unrecognized(reply) {
                reply.withText(
                    'Что-то я',
                    ['глуха', 'глух+а'],
                    'стала. Сядь ко мне на носик, да повтори ещё разок.'
                );

                reply.withText('Чем волк отличается от собаки?');
            },
            async onInput({ command }, state, setState): Promise<SimiScene> {
                return 'UnknownAttr';
            },
        },
        KnownAttr: {
            reply(reply) {

            },
            onTransition() {
                return 'Game';
            },
        },
        DogKnownAttr: {
            reply(reply) {

            },
            onTransition() {
                return 'Game';
            },
        },
        UnknownAttr: {
            reply(reply, state) {


                reply.withText(
                    'Не',
                    ['слыхала', 'слых+ала'],
                    'я раньше, что',
                    'волк' ,
                    'чихает',
                    '.'
                );
            },
            onTransition() {
                return 'Game';
            },
        },
    },
});

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

 */
