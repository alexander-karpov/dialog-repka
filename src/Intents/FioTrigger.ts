import { Input } from '../DialogBuilder2/Input';
import { FioIntent } from './FioIntent';
import { Trigger } from './Trigger';

export class FioTrigger extends Trigger<FioIntent> {
    override match(input: Input): FioIntent | undefined {
        const fioEntity = input.entities.find((e) => e.type === 'YANDEX.FIO');

        if (!fioEntity) {
            return undefined;
        }

        const { first_name, last_name } = fioEntity.value;

        if (first_name) {
            return {
                firstName: first_name,
                lastName: last_name,
            };
        }

        if (last_name) {
            return {
                firstName: first_name,
                lastName: last_name,
            };
        }
    }
}
