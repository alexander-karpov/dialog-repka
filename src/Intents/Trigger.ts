import { Input } from '../DialogBuilder2/Input';

export abstract class Trigger<TIntent> {
    abstract match(input: Input): TIntent | undefined;
}
