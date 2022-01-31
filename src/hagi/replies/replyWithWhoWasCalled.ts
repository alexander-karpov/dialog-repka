import { ReplyBuilder as ReplyBuilder2 } from '../../DialogBuilder2';
import { Character } from '../Character';
import { HagiModel } from '../HagiModel';

/**
 * Добавляет фразу "Кого позвал[a|о] [предыдущий персонаж]?"
 */
export function replyWithWhoWasCalled(reply: ReplyBuilder2, model: HagiModel): void {
    const lastChar = model.lastCharacter();
    const callWord = Character.byGender('позвал', 'позвала', 'позвало', 'позвали', lastChar);

    reply.withText([
        `Кого ${callWord} ${Character.nominative(lastChar)}?`,
        `Кого ${callWord} ${Character.nominativeTts(lastChar)}?`,
    ]);
}
