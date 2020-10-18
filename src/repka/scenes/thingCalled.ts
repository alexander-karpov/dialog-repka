import { RepkaSceneName } from '../RepkaSceneName';
import { Character } from '../Character';
import { replyWithKnownCharButtons } from '../replies/replyWithKnownCharButtons';
import { RepkaTransition } from '../RepkaTransition';

export const ThingCalled: RepkaTransition = {
    reply(reply, model) {
        const lastChar = model.lastCharacter();
        const calledWord = Character.byGender('звал', 'звала', 'звало', lastChar);

        reply.withText(
            `Долго ${calledWord} ${Character.nominative(lastChar)} ${Character.accusative(
                model.lastCalledCharacter()
            )} —`,
            [
                Character.byGender('не дозвался.', 'не дозвалась.', 'не дозвалось.', lastChar),
                Character.byGender(
                    ' - не дозв+ался.',
                    ' - не дозвал+ась.',
                    ' - не дозвал+ось.',
                    lastChar
                ),
            ],
            'Давайте позовем другого персонажа.'
        );

        replyWithKnownCharButtons(reply, model);
    },

    onTransition() {
        return RepkaSceneName.CallСharacter;
    },
};
