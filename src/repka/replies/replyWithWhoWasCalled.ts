import { ReplyBuilder as ReplyBuilder2 } from '../../DialogBuilder2';
import { Character } from '../Character';
import { RepkaModel } from '../RepkaModel';

/**
 * Добавляет фразу "Кого позвал[a|о] [предыдущий персонаж]?"
 */
export function replyWithWhoWasCalled(reply: ReplyBuilder2, model: RepkaModel): void {
    const lastChar = model.lastCharacter();
    const callWord = Character.byGender('позвал', 'позвала', 'позвало', lastChar);

    reply.withText(`Кого ${callWord} ${Character.nominative(lastChar)}?`);
}
