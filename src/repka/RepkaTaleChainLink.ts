import { Character } from './Character';
import { emoji } from './emoji';
import { last } from './last';

enum ChainLinkVesion {
    Full,
    Short,
    Shortest,
}

export class RepkaTaleChainLink {
    public versions: {
        full: [string, string];
        short: [string, string];
        shortest: [string, string];
    };

    constructor(private subj: Character, private obj: Character) {
        this.versions = this.getVersions();
    }

    getVersions(): {
        full: [string, string];
        short: [string, string];
        shortest: [string, string];
    } {
        const subj = this.subj.subject;
        const obj = this.obj.subject;

        const subjEmoji = Character.emoji(this.subj);
        const subjEmojiPart = subjEmoji ? ` ${subjEmoji}` : '';

        const objEmoji = Character.emoji(this.obj);
        const objEmojiPart = objEmoji ? ` ${objEmoji}` : '';

        const objAccusLastWord = last(obj.accusative.split(' ')) || obj.accusative;

        return {
            full: [
                `${subj.nominative}${subjEmojiPart} за ${obj.accusative}`,
                `${Character.nominativeTts(this.subj)} за ${Character.accusativeTts(this.obj)}`,
            ],
            short: [
                `за ${obj.accusative}${objEmojiPart}`,
                `за ${Character.accusativeTts(this.obj)}`,
            ],
            shortest: [`за ${objAccusLastWord}${objEmojiPart}`, `за ${objAccusLastWord}`],
        };
    }
}
