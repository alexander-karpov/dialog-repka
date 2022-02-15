import { HagiSceneName } from '../HagiSceneName';
import { HagiScene } from '../HagiScene';
import { WhoIsThisFeature } from '../features/WhoIsThisFeature';
import { BadWordFeature } from '../features/BadWordFeature';
import { ReversePersonFeature } from '../features/ReversePersonFeature';
import { RandomPhraseFeature } from '../features/RandomPhraseFeature';
import { HagiInput } from '../features/HagiInput';
import { DumpingPersonReverserService } from '../../repka/services/DumpingPersonReverserService';
import { CloudPersonReverserService } from '../../repka/services/CloudPersonReverserService';
import { CharactersFactory } from '../../repka/characters/CharactersFactory';
import { YesToNoFeature } from '../features/YesToNoFeature';
import { VerbTailFeature } from '../features/VerbTailFeature';
import { DropNoFeature } from '../features/DropNoFeature';
import { SplitByOrFeature } from '../features/SplitByOrFeature';
import { KissyMissyFeature } from '../features/KissyMissyFeature';
import { HelloFeature } from '../features/HelloFeature';
import { InfinitiveImperfectFeature } from '../features/InfinitiveImperfectFeature';
import { InfinitivePerfectFeature } from '../features/InfinitivePerfectFeature';

const personReverser = new DumpingPersonReverserService(new CloudPersonReverserService());
const charactersFactory = new CharactersFactory();

export const CallСharacter: HagiScene = {
    reply(reply, model) {
        // Hello hagi
    },

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

        const [personReversed, character] = await Promise.all([
            personReverser.reverse(input.originalUtterance),
            charactersFactory.create(input.command),
        ]);

        /** Дети часто говорят "не ешь" */
        /** Дети часто говорят Давай. Не будем менять его */
        for (const token of personReversed.tokens) {
            if (token[0] === 'ешь') {
                token[1] = 'съем';
            }

            if (token[0] === 'давай') {
                token[1] = 'давай';
            }
        }

        /**
         * Нужно отбросить мусорные звуки типа "а", "ну"
         */
        if (
            personReversed.tokens.length > 1 &&
            ['а', 'ну'].includes(personReversed.tokens[0]?.[0] ?? '')
        ) {
            personReversed.tokens.shift();
        }

        const hagiInput: HagiInput = {
            ...input,
            reversedTokens: personReversed.tokens,
            character: character,
        };

        if (
            await model.handle(
                [
                    BadWordFeature,
                    HelloFeature,
                    KissyMissyFeature,
                    SplitByOrFeature,
                    WhoIsThisFeature,
                    InfinitiveImperfectFeature,
                    InfinitivePerfectFeature,
                    RandomPhraseFeature,
                    DropNoFeature,
                    YesToNoFeature,
                    VerbTailFeature,
                    ReversePersonFeature,
                ],
                hagiInput,
                reply
            )
        ) {
            return HagiSceneName.TaleChain;
        }

        reply.pitchDownVoice(input.command);

        return HagiSceneName.TaleChain;
    },
};
