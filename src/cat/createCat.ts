import { Dialog } from '../DialogBuilder3';
import { ReplyBuilder, Input, Topic } from '../DialogBuilder3';
import { RandomProvider } from '../DialogBuilder3/RandomProvider';
import { TopicReply } from '../DialogBuilder3/Topic';

export function createCat() {
    const dialog = new Dialog(new RandomProvider());

    @dialog.register('Start', { default: true })
    class StartTopic implements Topic {
        async update(input: Input): TopicReply {
            const reply = new ReplyBuilder(new RandomProvider());
            reply.withText(
                'Кысь-кысь. Кто тут у нас? Это же мой знакомый котёнок.',
                'Хочешь с ним поговорить?',
                'Я немного знаю кошачий язык и буду переводить.',
                'Запомни главное правило кошачьего языка:',
                'если не знаешь, что сказать, скажи «мяу».',
                'Давай попробуем?'
            );

            return Promise.resolve(reply);
        }
    }

    // @dialog.register('Talk')
    // class TalkTopic extends Topic {
    //     override async update(input: Input) {
    //         const x = await Promise.resolve(1);

    //         if (x > 100) {
    //             return new ReplyBuilder(new RandomProvider());
    //         }
    //     }
    // }

    return dialog;
}
