import { DialogBuilder } from './DialogBuilder/DialogBuilder';
import { RepkaState } from './RepkaState';
import { RepkaScene } from './RepkaScene';
import { Character } from './Character';
import { configureEntryPoint } from './scenes/configureEntryPoint';
import { configureGreating } from './scenes/configureGreating';
import { configureQuit } from './scenes/configureQuit';
import { configureTaleBegin } from './scenes/configureTaleBegin';
import { configureTaleChain } from './scenes/configureTaleChain';
import { configureCallСharacter } from './scenes/configureCallСharacter';
import { configureThingCalled } from './scenes/configureThingCalled';
import { configureTaleEnd } from './scenes/configureTaleEnd';
import { configureTaleHelp } from './scenes/configureTaleHelp';
import { configureWhatCanYouDo } from './scenes/configureWhatCanYouDo';

const dialogBuilder = new DialogBuilder<RepkaState, RepkaScene>();

configureWhatCanYouDo(dialogBuilder);
configureEntryPoint(dialogBuilder.createScene(RepkaScene.EntryPoint));
configureGreating(dialogBuilder.createScene(RepkaScene.Greating));
configureQuit(dialogBuilder.createScene(RepkaScene.Quit));
configureTaleBegin(dialogBuilder.createScene(RepkaScene.TaleBegin));
configureTaleChain(dialogBuilder.createScene(RepkaScene.TaleChain));
configureCallСharacter(dialogBuilder.createScene(RepkaScene.CallСharacter));
configureThingCalled(dialogBuilder.createScene(RepkaScene.ThingCalled));
configureTaleEnd(dialogBuilder.createScene(RepkaScene.TaleEnd));
configureTaleHelp(dialogBuilder.createScene(RepkaScene.TaleHelp));

export const repka = dialogBuilder.build(RepkaScene.EntryPoint, {
    characters: [Character.dedka],
    seenKnownChars: [],
    lastCalledChar: Character.dedka,
    previousChar: Character.dedka,
});
