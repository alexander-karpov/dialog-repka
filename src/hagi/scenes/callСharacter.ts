import { HagiSceneName } from '../HagiSceneName';

import { HagiScene } from '../HagiScene';

import { WhoIsThisFeature } from '../features/WhoIsThisFeature';
import { YoureMoronFeature } from '../features/YoureMoronFeature';
import { ReverseFeature } from '../features/ReverseFeature';
import { ReversePersonFeature } from '../features/ReversePersonFeature';

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

        if (
            await model.handle(
                [YoureMoronFeature, WhoIsThisFeature, ReverseFeature, ReversePersonFeature],
                input,
                reply
            )
        ) {
            return HagiSceneName.TaleChain;
        }

        reply.pitchDownVoice(input.command);

        return HagiSceneName.TaleChain;
    },
};
