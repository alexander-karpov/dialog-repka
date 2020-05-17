import { RepkaScreenBuilder } from '../RepkaScreenBuilder';
import { RepkaScreen } from '../RepkaScreen';

export function configureQuit(screen: RepkaScreenBuilder) {
    screen.withReply((reply) => {
        reply.withText('Вот и сказке конец, а кто слушал — молодец.');
        reply.withEndSession();
    });

    screen.withTransition(() => RepkaScreen.EntryPoint);
}
