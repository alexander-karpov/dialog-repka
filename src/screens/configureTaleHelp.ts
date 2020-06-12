import { RepkaScreenBuilder } from '../RepkaScreenBuilder';
import { replyWithTaleHelp } from '../replies/replyWithTaleHelp';
import { RepkaScreen } from '../RepkaScreen';

export function configureTaleHelp(screen: RepkaScreenBuilder) {
    screen.withReply((reply, state) => {
        replyWithTaleHelp(reply, state);
    });

    screen.withTransition(() => RepkaScreen.CallСharacter);
}
