import { ReplyBuilder } from '../../DialogBuilder2';
import { RepkaModel } from '../RepkaModel';
import { knownChars } from '../knownChars';
import { KnownCharId } from '../KnownCharId';

type WithKnownCharButtonsOptions = {
    // Добавляет словесный призыв выбрать персонажа
    andVerbal?: boolean;
};

/**
 * Добавляет кнопки известных персонажей.
 */
export function replyWithKnownCharButtons(
    reply: ReplyBuilder,
    model: RepkaModel,
    { andVerbal }: WithKnownCharButtonsOptions = {}
):void {
    const mouse = knownChars.find((kc) => kc.id === KnownCharId.Mouse);

    const notSeenKnownChars = model.notSeenKnownChars();

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

    if (andVerbal && charHints.length) {
        const [first, second] = charHints;

        reply.withText('Например', first);

        if (second) {
            reply.withText(['или', ' - или'], second);
        }

        reply.withText('.');
    }
}
