import { RepkaSceneBuilder } from '../RepkaSceneBuilder';
import { RepkaScene } from '../RepkaScene';

export function configureQuit(scene: RepkaSceneBuilder) {
    scene.withReply((reply) => {
        reply.withText('Вот и сказке конец, а кто слушал — молодец.');
        reply.withEndSession();
    });

    scene.withTransition(() => RepkaScene.EntryPoint);
}
