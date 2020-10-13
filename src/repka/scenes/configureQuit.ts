import { RepkaScene } from '../RepkaScene';
import { RepkaTransitionBuilder } from '../RepkaTransitionBuilder';

export function configureQuit(scene: RepkaTransitionBuilder) {
    scene.withReply((reply) => {
        reply.withText('Вот и сказке конец, а кто слушал — молодец.');
        reply.withEndSession();
    });

    scene.withTransition(() => RepkaScene.EntryPoint);
}
