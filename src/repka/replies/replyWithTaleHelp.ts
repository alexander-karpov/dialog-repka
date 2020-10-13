import { ReplyBuilder } from '../../DialogBuilder/ReplyBuilder';
import { RepkaState } from '../RepkaState';
import { replyWithKnownCharButtons } from './replyWithKnownCharButtons';

/**
 * Добавляет текст подсказки
 */
export function replyWithTaleHelp(reply: ReplyBuilder, state: RepkaState) {
    reply.withText('В нашей сказке вы можете позвать любого персонажа.');
    replyWithKnownCharButtons(reply, state, { andVerbal: true });
}
