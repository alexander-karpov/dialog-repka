import { Dialog } from '../DialogBuilder3';
import { ReplyBuilder, Input, Topic } from '../DialogBuilder3';
import { RandomProvider } from '../DialogBuilder3/RandomProvider';
import { TopicReply } from '../DialogBuilder3/Topic';

export function createCat() {
    const dialog = new Dialog(new RandomProvider());

    @dialog.register('Start', { default: true, disposable: true })
    class StartTopic implements Topic {
        async update(input: Input): TopicReply {
            const reply = new ReplyBuilder(new RandomProvider());
            reply.text(
                'Кысь-кысь. Кто тут у нас? Это же мой знакомый котёнок.',
                'Хочешь с ним поговорить?',
                'Я немного знаю кошачий язык и буду переводить.',
                'Запомни главное правило кошачьего языка:',
                'если не знаешь, что сказать, скажи «мяу».',
                'Давай попробуем?'
            );

            reply.withTopics(new SayMeowTopic());

            return Promise.resolve(reply);
        }
    }

    @dialog.register('SayMeow', { disposable: true })
    class SayMeowTopic implements Topic {
        async update({ tokens, utterance: originalUtterance }: Input): TopicReply {
            const reply = new ReplyBuilder(new RandomProvider());

            if (tokens.includes('мяу')) {
                reply.text('Мяу-мяу. Кто здесь?');
                reply.withTopics(new TalkTopic());
            } else {
                reply.text(`Не «${originalUtterance}», а «мяу»`);
                reply.withTopics(this);
            }

            return Promise.resolve(reply);
        }
    }

    @dialog.register('Talk')
    class TalkTopic implements Topic {
        async update(input: Input) {
            const reply = new ReplyBuilder(new RandomProvider());

            //         const x = await Promise.resolve(1);
            // reversedTokens: nlpResult.text.map((w) =>
            // w.replace(/мя$/, 'мяу-').replace(/ня$/, 'няу-').replace(/му$/, 'мур-')
            //         if (x > 100) {
            //             return new ReplyBuilder(new RandomProvider());
            //         }

            reply.text(input.utterance);

            return Promise.resolve(reply);
        }
    }

    return dialog;
}
