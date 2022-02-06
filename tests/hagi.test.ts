import { createHagi } from '../src/hagi/createHagi';
import { TestClosure } from '../src/DialogBuilder2';
import { HagiSceneName } from '../src/hagi/HagiSceneName';
import { HagiModel } from '../src/hagi/HagiModel';

let closure: TestClosure<HagiSceneName, HagiModel>;

async function text(command: string, intent?: string) {
    const response = await (intent ? closure.handleIntent(intent) : closure.handleCommand(command));

    return response.text;
}

let random = 0;

beforeEach(() => {
    random = 0;
    closure = new TestClosure(createHagi({ getRandom: () => random }));
});

test('Проверка Хаги', async () => {
    expect(await text('')).toMatch(/Хаги/i);
});

describe('Фичи', () => {
    test('Переворот лиц', async () => {
        random = 1;

        await text('');
        expect(await text('ты повторяешь что я говорю')).toMatch(/я повторяю что ты говоришь/i);

        // ешь -> съем
        // давай -> давай
        expect(await text('давай только ты меня не ешь')).toMatch(/давай только я тебя не съем/i);
    });
});
