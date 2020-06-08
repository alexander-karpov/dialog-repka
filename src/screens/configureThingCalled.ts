import { RepkaScreenBuilder } from '../RepkaScreenBuilder';
import { RepkaScreen } from '../RepkaScreen';
import { Character } from '../Character';
import { last } from '../last';
import { replyWithKnownCharButtons } from '../replies/replyWithKnownCharButtons';

export function configureThingCalled(screen: RepkaScreenBuilder) {
    screen.withReply((reply, state) => {
        const lastChar = last(state.characters);
        const calledWord = Character.byGender('звал', 'звала', 'звало', lastChar);

        reply.withText(
            `Долго ${calledWord} ${Character.nominative(lastChar)} ${Character.accusative(
                state.lastCalledChar
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

        replyWithKnownCharButtons(reply, state);
    });

    screen.withTransition(() => {
        return RepkaScreen.CallСharacter;
    });
}
