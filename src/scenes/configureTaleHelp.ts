import { RepkaTransitionBuilder } from '../RepkaTransitionBuilder';
import { replyWithTaleHelp } from '../replies/replyWithTaleHelp';
import { RepkaScene } from '../RepkaScene';

export function configureTaleHelp(scene: RepkaTransitionBuilder) {
    scene.withReply((reply, state) => {
        replyWithTaleHelp(reply, state);
    });

    scene.withTransition(() => RepkaScene.CallСharacter);
}
