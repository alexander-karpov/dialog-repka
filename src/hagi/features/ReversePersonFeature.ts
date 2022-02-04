import { ReplyBuilder } from '../../DialogBuilder2';
import { Feature } from './Feature';
import { Input } from '../../DialogBuilder2/Input';
import { DumpingPersonReverserService } from '../../repka/services/DumpingPersonReverserService';
import { CloudPersonReverserService } from '../../repka/services/CloudPersonReverserService';

const personReverser = new DumpingPersonReverserService(new CloudPersonReverserService());

export class ReversePersonFeature extends Feature {
    static id = 'ReversePersonFeature';

    async implementation(input: Input, reply: ReplyBuilder): Promise<boolean> {
        const { reversed, tokens } = await personReverser.reverse(input.originalUtterance);

        if (reversed !== input.originalUtterance) {
            reply.pitchDownVoice(`${reversed}.`);
            return true;
        }

        return false;
    }
}
