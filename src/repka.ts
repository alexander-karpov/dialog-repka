import { DialogBuilder } from './DialogBuilder/DialogBuilder';
import { RepkaState } from './RepkaState';
import { RepkaScreen } from './RepkaScreen';
import { Character } from './Character';
import { configureEntryPoint } from './screens/configureEntryPoint';
import { configureGreating } from './screens/configureGreating';
import { configureQuit } from './screens/configureQuit';
import { configureBeginOfTale } from './screens/configureBeginOfTale';
import { configureTaleChain } from './screens/configureTaleChain';
import { configureCallСharacter } from './screens/configureCallСharacter';

const dialogBuilder = new DialogBuilder<RepkaState, RepkaScreen>();

configureEntryPoint(dialogBuilder.createScreen(RepkaScreen.EntryPoint));
configureGreating(dialogBuilder.createScreen(RepkaScreen.Greating));
configureQuit(dialogBuilder.createScreen(RepkaScreen.Quit));
configureBeginOfTale(dialogBuilder.createScreen(RepkaScreen.BeginOfTale));
configureTaleChain(dialogBuilder.createScreen(RepkaScreen.TaleChain));
configureCallСharacter(dialogBuilder.createScreen(RepkaScreen.CallСharacter));

export const repka = dialogBuilder.build(RepkaScreen.EntryPoint, {
    characters: [Character.dedka],
});
