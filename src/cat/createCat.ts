import { Dialog } from '../DialogBuilder3';
import { Input } from '../DialogBuilder3';
import { RandomProvider } from '../DialogBuilder3/RandomProvider';
import { BodyReply } from '../DialogBuilder3/ResponseBuilder';
import { TopicProposal } from '../DialogBuilder3/TopicProposal';

export function createCat() {
    const dialog = new Dialog(new RandomProvider());

    @dialog.register({ default: true })
    class GreatingTopic {
        update(input: Input) {
            return {
                replies: [
                    new BodyReply(
                        'Кысь-кысь. Кто тут у нас? Это же мой знакомый котёнок.',
                        'Хочешь с ним поговорить?',
                        'Я немного знаю кошачий язык и буду переводить.',
                        'Запомни главное правило кошачьего языка:',
                        'если не знаешь, что сказать, скажи «мяу».',
                        'Давай попробуем?'
                    ),
                ],
                continuation: this.sayMeow,
            };
        }

        sayMeow(input: Input): TopicProposal {
            if (input.tokens.includes('мяу')) {
                return { replies: [new BodyReply('Мяу-мяу. Кто здесь?')], continuation: false };
            }

            return {
                replies: [new BodyReply(`Не «${input.utterance}», а «мяу»`)],
            };
        }
    }

    @dialog.register({ default: true })
    class ChatterTopic {
        update(input: Input) {
            //         const x = await Promise.resolve(1);
            // reversedTokens: nlpResult.text.map((w) =>
            // w.replace(/мя$/, 'мяу-').replace(/ня$/, 'няу-').replace(/му$/, 'мур-')
            //         if (x > 100) {
            //             return new ReplyBuilder(new RandomProvider());
            //         }

            return { replies: [new BodyReply(input.utterance)] };
        }
    }

    return dialog;
}
