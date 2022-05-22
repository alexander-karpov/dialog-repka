import { ReplyBuilder } from '../DialogBuilder2';
import { Feature } from './features/Feature';
import { FeatureConstructor } from './features/FeatureConstructor';
import { HagiInput } from './features/HagiInput';

export class CatModel {
    private readonly featuresState: Record<string, Feature<HagiInput> | undefined> = {};
    public startPhrase?: string;

    async handle(
        features: FeatureConstructor<HagiInput>[],
        input: HagiInput,
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