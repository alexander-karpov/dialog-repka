import { Creature } from '../Creature';
import { Category } from '../Category';

export class Dog extends Creature {
    constructor() {
        super('собака', [
            [Category.Voice, 'лаять'],
            [Category.Color, 'коричневый'],
            [Category.Color, 'чёрный'],
            [Category.Color, 'белый'],
        ]);
    }
}
