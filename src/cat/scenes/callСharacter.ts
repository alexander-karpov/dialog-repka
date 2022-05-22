import { HagiSceneName } from '../HagiSceneName';
import { CatScene } from '../HagiScene';
import { WhoIsThisFeature } from '../features/WhoIsThisFeature';
import { BadWordFeature } from '../features/BadWordFeature';
import { ReversePersonFeature } from '../features/ReversePersonFeature';
import { RandomPhraseFeature } from '../features/RandomPhraseFeature';
import { HagiInput } from '../features/HagiInput';
import { DumpingPersonReverserService } from '../../services/DumpingPersonReverserService';
import { CloudPersonReverserService } from '../../services/CloudPersonReverserService';
import { CharactersFactory } from '../../repka/characters/CharactersFactory';
import { YesToNoFeature } from '../features/YesToNoFeature';
import { VerbTailFeature } from '../features/VerbTailFeature';
import { DropNoFeature } from '../features/DropNoFeature';
import { SplitByOrFeature } from '../features/SplitByOrFeature';
import { KissyMissyFeature } from '../features/KissyMissyFeature';
import { HelloFeature } from '../features/HelloFeature';
import { InfinitiveImperfectFeature } from '../features/InfinitiveImperfectFeature';
import { InfinitivePerfectFeature } from '../features/InfinitivePerfectFeature';
import { EnrichFeature } from '../features/EnrichFeature';
import { CloudNlpService } from '../../services/CloudNlpService';

const nlpService = new CloudNlpService();

export const CallСharacter: CatScene = {
    reply(reply, model) {},

    help(reply, model) {
        reply.pitchDownVoice('Они научили меня играть в повторюшу.');
        reply.silence(500);
        reply.pitchDownVoice(
            'Я буду играть с тобой. Я повторю, что ты скажешь.',
            'Но не зли меня.'
        );
        reply.silence(500);
        reply.pitchDownVoice('И если ты подойдёшь слишком близко.');
        reply.silence(300);
        reply.hamsterVoice(['Я съем тебя!', 'Я - съем - теб+я!']);

        reply.silence(500);
        reply.pitchDownVoice(['Если боишься, скажи «Выход».', 'Если боишься, скажи - - выход.']);

        reply.silence(500);
        reply.pitchDownVoice('А теперь скажи что-нибудь.');
    },

    unrecognized(reply, model) {
        reply.pitchDownVoice('Подойти поближе и повтори.');
    },

    async onInput(input, model, reply) {
        if (input.command === 'выход') {
            return HagiSceneName.Quit;
        }

        const nlpResult = await nlpService.process(input.originalUtterance);

        const hagiInput: HagiInput = {
            ...input,
            reversedTokens: nlpResult.text.map((w) =>
                w.replace(/мя$/, 'мяу-').replace(/ня$/, 'няу-').replace(/му$/, 'мур-')
            ),
        };

        if (
            await model.handle(
                [
                    // BadWordFeature,
                    // HelloFeature,
                    // KissyMissyFeature,
                    // SplitByOrFeature,
                    // WhoIsThisFeature,
                    // InfinitiveImperfectFeature,
                    // InfinitivePerfectFeature,
                    // RandomPhraseFeature,
                    // DropNoFeature,
                    // YesToNoFeature,
                    // EnrichFeature,
                    // VerbTailFeature,
                    ReversePersonFeature,
                ],
                hagiInput,
                reply
            )
        ) {
            return HagiSceneName.TaleChain;
        }

        reply.withText(input.originalUtterance);

        return HagiSceneName.TaleChain;
    },
};
