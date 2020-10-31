import { Character } from './Character';
import { KnownChar } from './KnownChar';
import { KnownCharId } from './KnownCharId';
import { knownChars } from './knownChars';
import { last } from './last';
import * as intents from './intents';

export class RepkaModel {
    /**
     * В списке всегда присутствует хотя бы один персонаж - Дедка.
     * Так что упрощаем себе жизнь и делаем тип [Character].
     */
    private chars: [Character] = [Character.dedka];
    /**
     * Известные персонажи, которых пользователь уже видел
     */
    private seenKnownChars: KnownCharId[] = [];

    /**
     * Это может быть недопустимый персонаж, поэтому
     * он не всегда равен last(characters)
     */
    private lastCalledChar: Character = Character.dedka;

    /**
     * Сохраняем индейс последней использованной персонажем фразы
     * чтобы она не повторялась подряд
     */
    private lastCharacterPhrase = '';

    isLastCharacterPhrase(phrase: string): boolean {
        return this.lastCharacterPhrase === phrase;
    }

    setLastCharacterPhrase(hrase: string): void {
        this.lastCharacterPhrase = hrase;
    }

    characters(): ReadonlyArray<Character> {
        return this.chars;
    }

    /**
     * Персонажи попарно.
     * [Дедка, Бабка], [Бабка, Внучка],…
     */
    pairs(): [Character, Character][] {
        const init = this.chars.slice(0, -1);

        return init.map((first, i) => [first, this.chars[i + 1]]);
    }

    lastCharacter(): Character {
        return last(this.chars);
    }

    lastCalledCharacter(): Character {
        return this.lastCalledChar;
    }

    /**
     * Предыдущий персонаж. Который позвал текущего
     */
    previousCharacter(): Character {
        if (this.chars.length > 1) {
            return this.chars[this.chars.length - 2];
        }

        return Character.dedka;
    }

    /**
     * Персонажи, которые ещё не приходили.
     * Для них можно вывести подсказки (кроме мышки).
     */
    notSeenKnownChars(): KnownChar[] {
        return knownChars.filter(
            (c) => !this.seenKnownChars.includes(c.id) && c.id !== KnownCharId.Mouse
        );
    }

    /**
     * Текущее число персонажей.
     */
    charsNumber(): number {
        return this.chars.length;
    }

    /**
     * Когда позвали предмет.
     */
    thingCalled(calledChar: Character): void {
        this.lastCalledChar = calledChar;
    }

    /**
     * Когда позвали персонажа.
     */
    charCalled(calledChar: Character): void {
        this.lastCalledChar = calledChar;
        this.chars.push(calledChar);

        const knownChar = knownChars.find((char) => char.trigger(calledChar));

        if (knownChar) {
            this.seenKnownChars.push(knownChar?.id);
        }
    }

    /**
     * Сказка заканчивается когда зовут мышку
     */
    isTaleEnd(): boolean {
        return intents.mouse(this.lastCalledChar);
    }

    /**
     * Сбрасывает состояние до начала сказки
     */
    startTale(): void {
        this.chars = [Character.dedka];
        this.seenKnownChars = [];
        this.lastCalledChar = Character.dedka;
    }
}
