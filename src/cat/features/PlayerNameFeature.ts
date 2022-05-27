import { ReplyBuilder } from '../../DialogBuilder3';
import { Feature } from '../../DialogBuilder3/Feature';
import { CatInput } from './CatInput';

export class PlayerNameFeature extends Feature<CatInput> {
    static override readonly id = 'PlayerNameFeature';

    public name?: string;

    override async implementation(input: CatInput, reply: ReplyBuilder): Promise<boolean> {
        if (this.name) {
            return false;
        }

        const nameEntity = input.entities.find((e) => e.type === 'YANDEX.FIO');

        if (!nameEntity) {
            return false;
        }

        this.name = nameEntity.value.first_name ?? nameEntity.value.last_name;

        if (!this.name) {
            return false;
        }

        reply.withText(`Буду звать тебя ${this.name}. Мур`);
        return true;
    }
}
