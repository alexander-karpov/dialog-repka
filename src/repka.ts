import { DialogBuilder } from './DialogBuilder/DialogBuilder';
import { RepkaState } from './RepkaState';
import { RepkaScreen } from './RepkaScreen';
import { Character } from './Character';
import { configureEntryPoint } from './screens/configureEntryPoint';
import { configureGreating } from './screens/configureGreating';
import { configureQuit } from './screens/configureQuit';
import { configureTaleBegin } from './screens/configureTaleBegin';
import { configureTaleChain } from './screens/configureTaleChain';
import { configureCallСharacter } from './screens/configureCallСharacter';
import { configureThingCalled } from './screens/configureThingCalled';
import { configureTaleEnd } from './screens/configureTaleEnd';

const dialogBuilder = new DialogBuilder<RepkaState, RepkaScreen>();

configureEntryPoint(dialogBuilder.createScreen(RepkaScreen.EntryPoint));
configureGreating(dialogBuilder.createScreen(RepkaScreen.Greating));
configureQuit(dialogBuilder.createScreen(RepkaScreen.Quit));
configureTaleBegin(dialogBuilder.createScreen(RepkaScreen.TaleBegin));
configureTaleChain(dialogBuilder.createScreen(RepkaScreen.TaleChain));
configureCallСharacter(dialogBuilder.createScreen(RepkaScreen.CallСharacter));
configureThingCalled(dialogBuilder.createScreen(RepkaScreen.ThingCalled));
configureTaleEnd(dialogBuilder.createScreen(RepkaScreen.TaleEnd));

export const repka = dialogBuilder.build(RepkaScreen.EntryPoint, {
    characters: [Character.dedka],
    seenKnownChars: [],
    lastCalledChar: Character.dedka,
    previousChar: Character.dedka,
});
