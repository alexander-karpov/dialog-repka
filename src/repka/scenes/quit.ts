import { RepkaEnding } from '../RepkaEnding';

export const Quit: RepkaEnding = {
    reply(reply) {
        reply.withText('Вот и сказке конец, а кто слушал — молодец.');
    }
}
