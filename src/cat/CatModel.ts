import { ReplyBuilder } from '../DialogBuilder3';
import { Feature } from '../DialogBuilder3/Feature';
import { FeatureConstructor } from '../DialogBuilder3/FeatureConstructor';
import { CatInput } from './features/CatInput';

export class CatModel {
    private readonly featuresState: Record<string, Feature<CatInput> | undefined> = {};

    public name?: string;

    async handle(
        features: FeatureConstructor<CatInput>[],
        input: CatInput,
        reply: ReplyBuilder
    ): Promise<boolean> {
        for (const feature of features) {
            const id = feature.id;
            let state = this.featuresState[id];

            if (state) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                state.__proto__ = feature.prototype;
            } else {
                state = new feature();
            }

            const stop = await state.handle(input, reply);

            if (stop) {
                this.featuresState[id] = state;
                return true;
            }
        }

        return false;
    }
}
