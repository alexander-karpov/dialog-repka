import { RepkaScreenBuilder } from '../RepkaScreenBuilder';
import { RepkaScreen } from '../RepkaScreen';
import { emoji } from '../emoji';
import { upperFirst } from '../utils/upperFirst';

export function configureTaleChain(screen: RepkaScreenBuilder) {
    screen.withReply((reply, { characters }) => {
        const text: string[] = [];
        const tts: string[] = [];

        for (let i = 0; i < characters.length - 1; i++) {
            const sub = characters[i + 1];
            const obj = characters[i];
            const em = emoji[sub.nominative] || emoji[sub.normal];
            const emojiPart = em ? ` ${em} ` : ' ';

            text.push(`${sub.nominative}${emojiPart} за ${obj.accusative}`);
            tts.push(`${sub.nominativeTts} за ${obj.accusativeTts}`);
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
