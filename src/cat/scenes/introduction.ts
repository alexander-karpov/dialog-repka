import { FioTrigger } from '../../Intents/FioTrigger';
import { CatScene } from '../CatScene';
import { CatSceneName } from '../CatSceneName';

export const Introduction: CatScene = {
    reply(reply) {
        reply.withText('Мяу-мяу. А ты кто?');
    },

    help(reply) {
        reply.withText('Если хочешь поговорить, давай познакомимся. Ты кто?');
    },

    async onInput(input, model, reply) {
        const fio = new FioTrigger().match(input);

        if (fio) {
            const name = fio.firstName ?? fio.lastName;
            reply.withText(`Буду звать тебя ${name}.`);
            model.name = name;
        } else {
            reply.withText(`Буду называть тебя человеком.`);
        }

        reply.withText(`Как ты сюда попал?`);
        return CatSceneName.Talk;
    },
};
