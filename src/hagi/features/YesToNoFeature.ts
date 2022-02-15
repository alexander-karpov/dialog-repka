import { ReplyBuilder } from '../../DialogBuilder2';
import { Feature } from './Feature';
import { Input } from '../../DialogBuilder2/Input';
import { HagiInput } from './HagiInput';

export class YesToNoFeature extends Feature<HagiInput> {
    static override readonly id = 'YesToNoFeature';

    override implementation({ command }: Input, reply: ReplyBuilder): boolean {
        if (this.wait([2, 4])) {
            return false;
        }

        switch (command) {
            case 'да':
                reply.pitchDownVoice('нет');
                break;
            case 'да да':
                reply.pitchDownVoice('нет. нет.');
                break;
            case 'нет':
                reply.pitchDownVoice('да');
                break;
            case 'нет нет':
                reply.pitchDownVoice('да. да.');
                break;
            default:
                return false;
        }

        return false;
    }
}
