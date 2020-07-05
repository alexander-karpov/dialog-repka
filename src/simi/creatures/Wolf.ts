import { Creature } from '../Creature';
import { Category } from '../Category';

export class Wolf extends Creature {
    constructor() {
        super('волк', [
            [Category.Color, 'серый'],
            [Category.Domestication, 'дикий'],
            [Category.Habitat, 'лес'],
            [Category.Temper, 'злой'],
            [Category.Voice, 'выть'],
        ]);
    }
}
