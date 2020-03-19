import { RepkaScreenBuilder } from '../RepkaScreenBuilder';
import { RepkaScreen } from '../RepkaScreen';

export function configureQuit(screen: RepkaScreenBuilder) {
    screen.withReply((reply, context) => {
        reply.withEndSession();
    });

    screen.withTransition(() => RepkaScreen.EntryPoint);
}
