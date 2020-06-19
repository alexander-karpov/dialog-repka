import { RepkaSceneBuilder } from '../RepkaSceneBuilder';
import { RepkaScene } from '../RepkaScene';

/**
 * Точка входа в игру. Определяет, что делать когда
 * игрок запустил диалог первый раз.
 */
export function configureEntryPoint(scene: RepkaSceneBuilder) {
    scene.withInput(() => {
        return RepkaScene.Greating;
    });
}
