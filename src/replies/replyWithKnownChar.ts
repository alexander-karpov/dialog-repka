import { ReplyBuilder } from '../DialogBuilder/ReplyBuilder';
import { RepkaState } from '../RepkaState';
import { Character } from '../Character';
import { KnownCharId } from '../KnownCharId';
import { KnownChar } from '../KnownChar';
import { MovementManner } from '../MovementManner';

/**
 * Добавляет фразу "Пришёл котик…' с картинкой и звуком
 */
export function replyWithKnownChar(
    reply: ReplyBuilder,
    { lastCalledChar, previousChar }: RepkaState,
    knownChar: KnownChar
) {
    const replyWithRandomSound = (char: KnownChar) =>
        reply.selectRandom((sound) => reply.withTts(`- ${sound}`), char.sounds, 1);

    /**
     * Картинка
     */
    if (knownChar.image) {
        reply.withImage(knownChar.image);
    }

    /**
     * Как пришёл
     */
    switch (knownChar.movement) {
        case MovementManner.Walketh:
            reply.withText(Character.byGender('Пришёл', 'Пришла', 'Пришло', lastCalledChar));
            break;
        case MovementManner.Running:
            reply.withText(
                Character.byGender('Прибежал', 'Прибежала', 'Прибежало', lastCalledChar)
            );
            break;
        case MovementManner.Flying:
            reply.withText(
                Character.byGender('Прилетел', 'Прилетела', 'Прилетело', lastCalledChar)
            );
            break;
        case MovementManner.Crawling:
            reply.withText(Character.byGender('Приполз', 'Приползла', 'Приползло', lastCalledChar));
            break;
        case MovementManner.Riding:
            reply.withText(
                Character.byGender('Прискакал', 'Прискакала', 'Прискакало', lastCalledChar)
            );
            break;
        case MovementManner.Jumping:
            reply.withText(
                Character.byGender('Припрыгал', 'Припрыгала', 'Припрыгало', lastCalledChar)
            );
            break;
    }

    /**
     * Кто пришёл
     */
    switch (knownChar.id) {
        case KnownCharId.Fish:
            break;

        case KnownCharId.Cat:
            // Добавляем «кошка» если позвали мурку
            if (Character.nominative(lastCalledChar) === 'мурка') {
                reply.withText('кошка');
            }

            reply.withText(Character.nominative(lastCalledChar));
            break;

        default:
            reply.withText(Character.nominative(lastCalledChar));
    }

    /**
     * Что сделал (звуки).
     */
    switch (knownChar.id) {
        case KnownCharId.Alice:
            reply.withText('Запустилась Алиса.');
            break;

        case KnownCharId.HarryPotter:
            reply.withText([`Акцио, репка!`, `+Акцо, репка!  - - - `]);
            break;

        case KnownCharId.Cat:
            const clung = Character.byGender('вцепился', 'вцепилась', 'вцепилось', lastCalledChar);
            replyWithRandomSound(knownChar);
            reply.withText(['- мяу -', '-']);
            reply.withText(`и ${clung} в ${Character.accusative(previousChar)}.`);
            break;

        case KnownCharId.Zombie:
            replyWithRandomSound(knownChar);
            reply.withTts('-');
            reply.withText(`и схватило ${Character.accusative(previousChar)}.`);
            break;

        case KnownCharId.Fish:
            const nemu = Character.byGender('нему', 'ней', 'нему', previousChar);
            const poshel = Character.byGender('Пошёл', 'Пошла', 'Пошло', previousChar);
            const stalOn = Character.byGender('стал он', 'стала она', 'стало оно', previousChar);

            reply.withText(
                `${poshel} ${Character.nominative(previousChar)} к синему морю;`,
                ['', '<speaker audio="alice-sounds-nature-sea-1.opus"> - - '],
                `${stalOn} кликать ${Character.accusative(
                    lastCalledChar
                )}, приплыла к ${nemu} ${Character.normal(lastCalledChar)}, спросила:`,
                `«Чего тебе надобно, ${Character.nominative(previousChar)}?»`,
                `Ей с поклоном ${Character.nominative(previousChar)} отвечает:`,
                `«Смилуйся, государыня ${Character.normal(lastCalledChar)}, помоги вытянуть репку.»`
            );

            break;

        default:
            replyWithRandomSound(knownChar);
            reply.withText('.');
    }
}
