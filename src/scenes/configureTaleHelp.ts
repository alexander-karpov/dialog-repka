import { RepkaSceneBuilder } from '../RepkaSceneBuilder';
import { replyWithTaleHelp } from '../replies/replyWithTaleHelp';
import { RepkaScene } from '../RepkaScene';

export function configureTaleHelp(scene: RepkaSceneBuilder) {
    scene.withReply((reply, state) => {
        replyWithTaleHelp(reply, state);
    });

    scene.withTransition(() => RepkaScene.CallСharacter);
}
