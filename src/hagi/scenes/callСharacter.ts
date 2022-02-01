import { RepkaSceneName } from '../RepkaSceneName';
import { Character } from '../Character';
import { replyWithWhoWasCalled } from '../replies/replyWithWhoWasCalled';
import { replyWithKnownCharButtons } from '../replies/replyWithKnownCharButtons';
import { replyWithTaleHelp } from '../replies/replyWithTaleHelp';
import { RepkaScene } from '../RepkaScene';
import { CharactersFactory } from '../characters/CharactersFactory';

const charactersFactory = new CharactersFactory();

export const CallСharacter: RepkaScene = {
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

    async onInput({ isConfirm, command, originalUtterance }, model) {
        const calledChar = await charactersFactory.create(command);

        if (command === 'выход') {
            return RepkaSceneName.Quit;
        }

        model.repeatText = originalUtterance;
        return RepkaSceneName.TaleChain;

        /**
         * Часто в самом начале игры люди вместо того, чтобы назвать персонажа,
         * отвечают на вопрос "Хотите поиграть…" и говорят "Да"
         */
        // if (isConfirm) {
        //     return RepkaSceneName.CallСharacter;
        // }

        // if (['не знаю', 'никого'].includes(command)) {
        //     return RepkaSceneName.TaleHelp;
        // }

        // if (!calledChar) {
        //     return undefined;
        // }

        // if (Character.isThing(calledChar)) {
        //     model.thingCalled(calledChar);
        //     sendEvent('ThingCalled', { thing: calledChar.subject.nominative });

        //     return RepkaSceneName.ThingCalled;
        // }

        // model.charCalled(calledChar);
        // sendEvent('CharCalled', { thing: calledChar.subject.nominative });

        // return RepkaSceneName.TaleChain;
    },
};
