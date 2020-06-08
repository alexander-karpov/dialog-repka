import { ReplyBuilder } from '../DialogBuilder/ReplyBuilder';
import { RepkaState } from '../RepkaState';
import { knownChars } from '../knownChars';
import { KnownCharId } from '../KnownCharId';

/**
 * Добавляет кнопки известных персонажей.
 */
export function replyWithKnownCharButtons(reply: ReplyBuilder, { seenKnownChars }: RepkaState) {
    const mouse = knownChars.find((kc) => kc.id === KnownCharId.Mouse);

    const notSeenKnownChars = knownChars.filter(
        (kc) => !seenKnownChars.includes(kc.id) && kc !== mouse
    );

    /**
     * Предлагаем Мышку только если других вариантов не осталось
     */
    if (notSeenKnownChars.length === 0 && mouse) {
        reply.withButton(mouse.hint);
        return;
    }

    const howManyButtonsAdd = 2 - reply.buttonsCount;

    reply.selectRandom(
        (knownChar) => reply.withButton(knownChar.hint),
        notSeenKnownChars,
        howManyButtonsAdd
    );
}
