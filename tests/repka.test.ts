// import { repka } from '../src/repka';
// import { RepkaScreen } from '../src/RepkaScreen';
// import { RepkaState } from '../src/RepkaState';
// import { createDialogRequestStub } from './createDialogRequestStub';

// let context: DialogContext<RepkaState, RepkaScreen>;

// beforeEach(() => {
//     context = {
//         score: 0,
//         $currentScreen: RepkaScreen.EntryPoint,
//         $previousScreen: RepkaScreen.EntryPoint,
//     };
// });

// test('game', () => {
//     expect(interactThenText('')).toMatch(/добро пожаловать в игру/i);
//     expect(interactThenText('да')).toMatch(/прослушайте мелодию/i);
//     expect(interactThenText('тула')).toMatch(/правильный ответ/i);
// });

// function interactThenText(command: string): string {
//     const response = repka.interact(createDialogRequestStub(command));

//     return response.response.text;
// }

// function interactThenTts(command: string): string | undefined {
//     const response = repka.interact(createDialogRequestStub(command));

//     return response.response.tts;
// }
