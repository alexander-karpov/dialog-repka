import { Gender } from './Gender';
import { Word } from './Word';
import { CharacterType } from './CharacterType';

/**
 * ВНИМАНИЕ:
 *  Этот объект сериализуется в JSON и теряет свой прототип.
 *  Поэтому все методы в нём должны быть статическими.
 */
export class Character {
    constructor(
        public type: CharacterType,
        public subject: Word,
        private gender: Gender,
        // Нормальная форма главного слова.
        // Помогает при определении, кто это.
        public normal: string,
        private tts?: Word
    ) {}

    static dedka = new Character(
        CharacterType.Сreature,
        { nominative: 'дедка', accusative: 'дедку' },
        Gender.Male,
        'дедка'
    );

    static nominative(char: Character): string {
        return char.subject.nominative;
    }

    static accusative(char: Character): string {
        return char.subject.accusative;
    }

    static normal(char: Character): string {
        return char.normal;
    }


    static nominativeTts(char: Character): string {
        return char.tts ? char.tts.nominative : char.subject.nominative;
    }

    static accusativeTts(char: Character): string {
        return char.tts ? char.tts.accusative : char.subject.accusative;
    }

    static isThing(char: Character): boolean {
        return char.type === CharacterType.Thing;
    }

    static firstLetter(char: Character): string {
        const letter = char.normal.charAt(0).toLowerCase();
        const letter2 = letter.replace('й', 'и');

        return letter2;
    }

    static lastLetter(char: Character): string {
        const letter = char.normal.charAt(char.normal.length - 1).toLowerCase();
        const letter2 =
            letter === 'ь' ? char.normal.charAt(char.normal.length - 2).toLowerCase() : letter;
        const letter3 = letter2.replace('й', 'и');

        return letter3;
    }

    static byGender<T>(male: T, famela: T, other: T, char: Character) {
        if (char.gender === Gender.Male || char.gender === Gender.Unisex) {
            return male;
        }

        return char.gender === Gender.Famela ? famela : other;
    }

    static startsWith(searchString: string | string[], char: Character): boolean {
        if (Array.isArray(searchString)) {
            return searchString.some((start) => Character.startsWith(start, char));
        }

        return char.normal.startsWith(searchString);
    }

    static equals(normal: string | string[], char: Character): boolean {
        if (Array.isArray(normal)) {
            return normal.some((n) => Character.equals(n, char));
        }

        return char.normal === normal;
    }
}
