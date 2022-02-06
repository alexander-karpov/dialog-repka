import { ReplyBuilder } from '../../DialogBuilder2';
import { Feature } from './Feature';
import { Input } from '../../DialogBuilder2/Input';
import { HagiInput } from './HagiInput';

export class YesToNoFeature extends Feature<HagiInput> {
    static override readonly id = 'YesToNoFeature';

    override implementation({ tokens }: Input, reply: ReplyBuilder): boolean {
        if (
            this.isMessagesPassed(5) &&
            tokens.length === 1 &&
            (tokens[0] === 'да' || tokens[0] === 'нет')
        ) {
            if (tokens[0] === 'да') {
                reply.pitchDownVoice('нет');
            } else {
                reply.pitchDownVoice('да');
            }

            return true;
        }

        return false;
    }
}
