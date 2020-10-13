import { ReplyBuilder } from '../../DialogBuilder/ReplyBuilder';
import { RepkaState } from '../RepkaState';
import { last } from '../last';
import { Character } from '../Character';

/**
 * Добавляет фразу "Кого позвал[a|о] [предыдущий персонаж]?"
 */
export function replyWithWhoWasCalled(reply: ReplyBuilder, { characters }: RepkaState) {
    const lastChar = last(characters);
    const callWord = Character.byGender('позвал', 'позвала', 'позвало', lastChar);

    reply.withText(`Кого ${callWord} ${Character.nominative(lastChar)}?`);
}
