import { RepkaSceneName } from '../RepkaSceneName';
import { Character } from '../Character';
import { replyWithWhoWasCalled } from '../replies/replyWithWhoWasCalled';
import { replyWithKnownCharButtons } from '../replies/replyWithKnownCharButtons';
import { replyWithTaleHelp } from '../replies/replyWithTaleHelp';
import { RepkaScene } from '../RepkaScene';
import { sendEvent } from '../sendEvent';
import { CharactersFactory } from '../characters/CharactersFactory';

const charactersFactory = new CharactersFactory();

export const CallСharacter: RepkaScene = {
    reply(reply, model) {
        replyWithWhoWasCalled(reply, model);

        if (model.charsNumber() > 2) {
            replyWithKnownCharButtons(reply, model);
        }
    },

    help(reply, model) {
        replyWithTaleHelp(reply, model);
        replyWithWhoWasCalled(reply, model);
    },

    unrecognized(reply, model) {
        sendEvent('UnrecognizedCharacter');

        reply.selectRandom(
            (variant) => {
                if (variant) {
                    reply.withText(
                        ['Что-то я глуха стала.', 'Что-то я глух+а ст+ала. -'],
                        'Сядь-ка ко мне',
                        ['на носик,', 'на носик - -'],
                        'да повтори ещё разок.'
                    );

                    replyWithKnownCharButtons(reply, model, { andVerbal: false });

                    return;
                }

                reply.withText('Это не похоже на персонажа.');
                reply.withText('В нашей сказке вы можете позвать любого персонажа.');
                replyWithKnownCharButtons(reply, model, { andVerbal: true });
            },
            [true, false, false]
        );

        replyWithWhoWasCalled(reply, model);
    },

    async onInput({ isConfirm, command }, model) {
        model.repeatText = command;
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

        // const calledChar = await charactersFactory.create(command);

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
