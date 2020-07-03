import { Creature } from '../Creature';
import { Category } from '../Category';

export class Wolf extends Creature {
    constructor() {
        super([
            [Category.Voice, 'выть'],
            [Category.Color, 'серый'],
        ]);
    }
}
