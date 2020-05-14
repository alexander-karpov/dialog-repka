import { RepkaScreenBuilder } from '../RepkaScreenBuilder';
import { RepkaScreen } from '../RepkaScreen';

/**
 * Точка входа в игру. Определяет, что делать когда
 * игрок запустил диалог первый раз.
 */
export function configureEntryPoint(screen: RepkaScreenBuilder) {
    screen.withInput(() => {
        return RepkaScreen.Greating;
    });
}
