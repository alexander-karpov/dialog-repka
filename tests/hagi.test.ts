import { createHagi } from '../src/hagi/createHagi';
import { TestClosure } from '../src/DialogBuilder2';
import { HagiSceneName } from '../src/hagi/HagiSceneName';
import { HagiModel } from '../src/hagi/HagiModel';

let closure: TestClosure<HagiSceneName, HagiModel>;

async function text(command: string, intent?: string) {
    const response = await (intent ? closure.handleIntent(intent) : closure.handleCommand(command));

    return response.text;
}

async function tts(command: string, intent?: string) {
    const response = await (intent ? closure.handleIntent(intent) : closure.handleCommand(command));

    return response.tts;
}

beforeEach(() => {
    closure = new TestClosure(createHagi({ getRandom: () => 0 }));
});

test('Проверка Хаги', async () => {
    expect(await text('')).toMatch(/Хаги/i);
});
