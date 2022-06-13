import { Dialog, Topic } from '../DialogBuilder3';
import { Input } from '../DialogBuilder3';
import { ResponseBuilder } from '../DialogBuilder3/ResponseBuilder';
import { Reply } from '../DialogBuilder3/Reply';
import { TopicProposal } from '../DialogBuilder3/TopicProposal';
import { CloudNlpService } from '../services/CloudNlpService';
import { NlpResult } from '../interfaces/NlpResult';

export const dialog = new Dialog();

class CatReply extends Reply {
    override addTo(reply: ResponseBuilder): void {
        this.cattifyText();

        return super.addTo(reply);
    }

    private cattifyText() {
        const pattern = /(мя|ня|му)([^а-я|А-Я]|$)/;

        const encode = new Map([
            ['мя', 'мяу'],
            ['ня', 'няу'],
            ['му', 'мур'],
        ]);

        this.text = this.text.map((t) => t.replace(pattern, (m) => encode.get(m) ?? m));

        this.tts = this.tts.map((t) =>
            t.replace(pattern, (m) => (encode.has(m) ? `${encode.get(m)}-` : m))
        );
    }
}

@dialog.input
class CatInput extends Input {
    static cloudNlpService = new CloudNlpService();

    nlp!: NlpResult;

    override async preprocess(): Promise<void> {
        this.nlp = await CatInput.cloudNlpService.process(this.utterance);
    }
}

@dialog.register()
export class GreatingTopic extends Topic {
    override update(input: CatInput) {
        if (input.isNewSession) {
            return {
                body: new CatReply(
                    'Кысь-кысь. Кто тут у нас? Это же мой знакомый котёнок.',
                    'Хочешь с ним поговорить?',
                    'Я немного знаю кошачий язык и буду переводить.',
                    'Запомни главное правило кошачьего языка:',
                    'если не знаешь, что сказать, скажи «мяу».',
                    'Давай попробуем?'
                ),
                continuation: this.sayMeow,
            };
        }
    }

    sayMeow(input: Input): TopicProposal {
        if (input.tokens.includes('мяу')) {
            return {
                body: new CatReply('Мяу. Кто здесь?'),
                continuation: false,
            };
        }

        return {
            body: new CatReply(`Не «${input.utterance}», а «мяу»`),
        };
    }
}

@dialog.register()
export class ChatterTopic extends Topic {
    override update(input: CatInput) {
        return { body: new CatReply(input.nlp.text.join(' ')) };
    }
}

// @dialog.register()
// export class СosmonautTopic extends Topic {
//     override update(input: Input) {
//         //         const x = await Promise.resolve(1);
//         // reversedTokens: nlpResult.text.map((w) =>
//         // w.replace(/мя$/, 'мяу-').replace(/ня$/, 'няу-').replace(/му$/, 'мур-')
//         //         if (x > 100) {
//         //             return new ReplyBuilder(new RandomProvider());
//         //         }

//         return { body: [new CatReply(input.utterance)] };
//     }
// }
