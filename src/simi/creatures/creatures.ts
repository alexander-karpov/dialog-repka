import { Wolf } from './Wolf';
import { CreatureName } from '../CreatureName';
import { Creature } from '../Creature';
import { Dog } from './Dog';

export const creatures: Record<CreatureName, Creature> = {
    'волк': new Wolf(),
    'собака': new Dog()
}
