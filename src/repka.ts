import { DialogBuilder } from './DialogBuilder/DialogBuilder';
import { RepkaState } from './RepkaState';
import { RepkaScreen } from './RepkaScreen';
import { configureEntryPoint } from './screens/configureEntryPoint';
import { configureGreating } from './screens/configureGreating';
import { configureQuit } from './screens/configureQuit';

const dialogBuilder = new DialogBuilder<RepkaState, RepkaScreen>();
configureEntryPoint(dialogBuilder.createScreen(RepkaScreen.EntryPoint));
configureGreating(dialogBuilder.createScreen(RepkaScreen.Greating));
configureQuit(dialogBuilder.createScreen(RepkaScreen.Quit));

export const repka = dialogBuilder.build(RepkaScreen.EntryPoint, {
    score: 0,
});
