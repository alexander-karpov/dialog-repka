import { ReplyBuilder } from '../DialogBuilder/ReplyBuilder';
import { RepkaState } from '../RepkaState';
import { knownChars } from '../knownChars';
import { KnownCharId } from '../KnownCharId';

type WithKnownCharButtonsOptions = {
    // Добавляет словесный призыв выбрать персонажа
    andVerbal?: Boolean;
};

/**
 * Добавляет кнопки известных персонажей.
 */
export function replyWithKnownCharButtons(
    reply: ReplyBuilder,
    { seenKnownChars }: RepkaState,
    { andVerbal }: WithKnownCharButtonsOptions = {}
) {
    const mouse = knownChars.find((kc) => kc.id === KnownCharId.Mouse);

    const notSeenKnownChars = knownChars.filter(
        (kc) => !seenKnownChars.includes(kc.id) && kc !== mouse
    );

    const charHints: string[] = [];

    /**
     * Предлагаем Мышку только если других вариантов не осталось
     */
    if (notSeenKnownChars.length === 0 && mouse) {
        charHints.push(mouse.hint);
    } else {
        const howManyButtonsAdd = 2 - reply.buttonsCount;

        reply.selectRandom(
            (knownChar) => charHints.push(knownChar.hint),
            notSeenKnownChars,
            howManyButtonsAdd
        );
    }

    charHints.forEach((hint) => reply.withButton(hint));

    if (andVerbal) {
        reply.withText(`Например можно позвать ${charHints.join(' или ').toLowerCase()}.`);
    }
}
