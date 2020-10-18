import { ReplyBuilder } from '../../DialogBuilder2';
import { RepkaModel } from '../RepkaModel';
import { replyWithKnownCharButtons } from './replyWithKnownCharButtons';

/**
 * Добавляет текст подсказки
 */
export function replyWithTaleHelp(reply: ReplyBuilder, model: RepkaModel): void {
    reply.withText('В нашей сказке вы можете позвать любого персонажа.');
    replyWithKnownCharButtons(reply, model, { andVerbal: true });
}
