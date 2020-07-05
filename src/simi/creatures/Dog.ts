import { Creature } from '../Creature';
import { Category } from '../Category';

export class Dog extends Creature {
    constructor() {
        super('собака', [
            [Category.Color, 'белый'],
            [Category.Color, 'коричневый'],
            [Category.Color, 'чёрный'],
            [Category.Domestication, 'домашний'],
            [Category.Habitat, 'дом'],
            [Category.Habitat, 'улица'],
            [Category.Temper, 'добрый'],
            [Category.Voice, 'лаять'],
        ]);
    }
}
