import { GrammaticalNumber } from '../../language/GrammaticalNumber';
import { Character } from '../Character';
import { CharacterType } from '../CharacterType';
import { Gender } from '../Gender';
import { Grammeme } from '../../language/Grammeme';
import { EntityRecognitionResult } from '../interfaces/EntityRecognitionResult';
import { CloudEntityRecognitionService } from '../services/CloudEntityRecognitionService';
import { DumpingEntityRecognitionService } from '../services/DumpingEntityRecognitionService';

const entityRecognitionService = new DumpingEntityRecognitionService(
    new CloudEntityRecognitionService()
);

export class CharactersFactory {
    async create(command: string): Promise<Character | undefined> {
        const fixedCommand = this.fixCommand(command);
        const entity = await this.recognizeEntity(fixedCommand);

        if (!entity) {
            return undefined;
        }

        if (this.isJuchka(fixedCommand, entity)) {
            return this.createJuchka();
        }

        if (this.isPoo(entity)) {
            return this.createPoo(entity);
        }

        if (this.isHuggyWuggy(entity)) {
            return this.createHuggyWuggy(entity);
        }

        if (this.isKissyMissy(command)) {
            return this.createKissyMissy();
        }

        return this.createCommon(entity);
    }

    private async recognizeEntity(command: string): Promise<EntityRecognitionResult | undefined> {
        const entities = await entityRecognitionService.recognize(command);
        entities.reverse();
        return entities.find((e) => e.tags.includes(Grammeme.Anim)) ?? entities[0];
    }

    private createCommon(entity: EntityRecognitionResult): Character {
        return new Character(
            this.extractCharacterType(entity.tags),
            {
                nominative: entity.enriched_nomn ?? entity.nomn,
                accusative: entity.enriched_accs ?? entity.accs,
            },
            this.extractGender(entity.tags),
            entity.subject.join(' '),
            undefined,
            this.extractNumber(entity.tags),
            this.extractIsPerson(entity.tags)
        );
    }

    private extractGender(tags: string): Gender {
        if (tags.includes(Grammeme.Masc)) {
            return Gender.Male;
        }

        if (tags.includes(Grammeme.Femn)) {
            return Gender.Famela;
        }

        if (tags.includes(Grammeme.Msf)) {
            return Gender.Common;
        }

        return Gender.Neuter;
    }

    private extractCharacterType(tags: string): CharacterType {
        if (tags.includes(Grammeme.Anim)) {
            return CharacterType.Сreature;
        }

        return CharacterType.Thing;
    }

    private extractNumber(tags: string): GrammaticalNumber {
        if (tags.includes('plur')) {
            return GrammaticalNumber.Plural;
        }

        return GrammaticalNumber.Singular;
    }

    private extractIsPerson(tags: string): boolean {
        return tags.includes('Name') || tags.includes('Surn') || tags.includes('Patr');
    }

    private isJuchka(command: string, entity: EntityRecognitionResult): boolean {
        if (command === 'жучок') {
            return false;
        }

        return entity.subject.includes('жучок') || entity.subject.includes('жучка');
    }

    private createJuchka(): Character {
        return new Character(
            CharacterType.Сreature,
            {
                nominative: 'жучка',
                accusative: 'жучку',
            },
            Gender.Famela,
            'жучка',
            {
                nominative: 'ж+учка',
                accusative: 'ж+учку',
            }
        );
    }

    private isPoo(entity: EntityRecognitionResult): boolean {
        return entity.subject.includes('какашка');
    }

    private createPoo(entity: EntityRecognitionResult): Character {
        const char = this.createCommon(entity);
        char.type = CharacterType.Сreature;

        return char;
    }

    private isHuggyWuggy(entity: EntityRecognitionResult): boolean {
        const [huggy, wuggy] = entity.subject;

        return huggy === 'хаги' && wuggy === 'вага';
    }

    private createHuggyWuggy(entity: EntityRecognitionResult): Character {
        const char = this.createCommon(entity);
        char.normal = 'хаги ваги';
        char.subject.nominative = 'хаги ваги';
        char.subject.accusative = 'хаги ваги';

        return char;
    }

    private isKissyMissy(command: string): boolean {
        return command.includes('киси миси');
    }

    private createKissyMissy(): Character {
        return new Character(
            CharacterType.Сreature,
            {
                nominative: 'киси миси',
                accusative: 'киси миси',
            },
            Gender.Famela,
            'киси миси',
            {
                nominative: 'к+иси м+иси',
                accusative: 'к+иси м+иси',
            },
            GrammaticalNumber.Singular,
            true
        );
    }

    private fixCommand(command: string): string {
        // Очеть часто встречается повтор одного и того же слова
        const dedup: string[] = [];

        for (const word of command.split(' ')) {
            if (!dedup.length || dedup[dedup.length - 1] !== word) {
                dedup.push(word);
            }
        }

        /**
         * Дети случайно зовут сучку или ручку вместо жучки
         * Баку вместо баки
         * Пробел вначале добавляем, чтобы не распознавать отдельно
         * начало текста. Симлов границы слова для кирилицы не работает.
         */
        dedup.unshift(' ');

        return dedup
            .join(' ')
            .replace(' внучка', ' внучку')
            .replace(/\s[с|р]учк/, ' жучк')
            .replace(/\sдетк[а|у]/, ' дедку')
            .replace(/\sночк[а|у]/, ' дочка')
            .replace(/\sбаку/, ' бабку')
            .trim();
    }
}
