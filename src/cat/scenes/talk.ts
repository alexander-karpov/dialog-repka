import { CatSceneName } from '../CatSceneName';
import { CatScene } from '../CatScene';
import { ReversePersonFeature } from '../features/ReversePersonFeature';
import { CatInput } from '../features/CatInput';
import { CloudNlpService } from '../../services/CloudNlpService';

const nlpService = new CloudNlpService();

export const Talk: CatScene = {
    reply() {},

    help(reply) {
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

    unrecognized(reply) {
        reply.pitchDownVoice('Подойти поближе и повтори.');
    },

    async onInput(input, model, reply) {
        if (input.command === 'выход') {
            return CatSceneName.Quit;
        }

        const nlpResult = await nlpService.process(input.originalUtterance);

        const hagiInput: CatInput = {
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
            return CatSceneName.Talk;
        }

        reply.withText(input.originalUtterance);

        return CatSceneName.Talk;
    },
};
