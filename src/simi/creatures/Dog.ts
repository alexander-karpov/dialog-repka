import { Creature } from '../Creature';
import { Category } from '../Category';
import { FeaturesSet } from '../FeaturesSet';

export class Dog extends Creature {
    constructor() {
        super([
            [Category.Voice, 'лаять'],
            [Category.Color, 'коричневый'],
            [Category.Color, 'чёрный'],
            [Category.Color, 'белый'],
        ]);
    }
}
