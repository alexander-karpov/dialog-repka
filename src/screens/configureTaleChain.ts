import { RepkaScreenBuilder } from '../RepkaScreenBuilder';
import { RepkaScreen } from '../RepkaScreen';
import { emoji } from '../emoji';
import { upperFirst } from '../upperFirst';
import { Character } from '../Character';

export function configureTaleChain(screen: RepkaScreenBuilder) {
    screen.withReply((reply, { characters }) => {
        const text: string[] = [];
        const tts: string[] = [];

        for (let i = 0; i < characters.length - 1; i++) {
            const sub = characters[i + 1];
            const obj = characters[i];
            const em = emoji[Character.nominative(sub)] || emoji[sub.normal];
            const emojiPart = em ? ` ${em} ` : ' ';

            text.push(`${Character.nominative(sub)}${emojiPart} за ${Character.accusative(obj)}`);
            tts.push(`${Character.nominativeTts(sub)} за ${Character.accusativeTts(obj)}`);
        }

        text.reverse();
        tts.reverse();

        return reply.withText(
            [upperFirst(text.join(', ')), tts.join(' - ')],
            [`, дедка 👴 за репку.`, ' - дедка за репку.']
        );
    });

    screen.withTransition((state, setState) => {
        return RepkaScreen.CallСharacter;
    });
}
