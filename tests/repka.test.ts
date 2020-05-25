import { repka } from '../src/repka';
import { Dialog } from '../src/DialogBuilder/Dialog';
import { DialogResponse } from '../src/DialogBuilder/DialogResponse';

class DialogTestClosure<TState, TSceneId> {
    private state!: TState;

    constructor(private readonly dialog: Dialog<TState, TSceneId>) {}

    async next(command: string): Promise<string> {
        return (await this.handleRequest(command)).response.text;
    }

    async nextTts(command: string): Promise<string | undefined> {
        return (await this.handleRequest(command)).response.tts;
    }

    private async handleRequest(command: string): Promise<DialogResponse> {
        const response = await this.dialog.handleRequest({
            meta: {
                locale: 'ru-RU',
                timezone: 'Europe/Moscow',
            },
            request: {
                command: command,
                original_utterance: command,
                markup: {
                    dangerous_context: false,
                },
                nlu: {
                    tokens: command.split(' '),
                    intents: {},
                },
            },
            state: {
                session: this.state || {},
            },
            session: {
                new: false,
                message_id: 1,
                session_id: '2eac4854-fce721f3-b845abba-20d60',
                skill_id: '3ad36498-f5rd-4079-a14b-788652932056',
                application: {
                    application_id:
                        'AC9WC3DF6FCE052E45A4566A48E6B7193774B84814CE49A922E163B8B29881DC',
                },
            },
            version: '1.0',
        });

        this.state = <TState>response.session_state;

        return response;
    }
}

test('Классическая сказка: начало', async () => {
    const closure = new DialogTestClosure(repka);

    expect(await closure.next('')).toMatch(/посадил дед репку/i);
});

test('Классическая сказка: история', async () => {
    const closure = new DialogTestClosure(repka);

    await closure.next('');
    await closure.next('Бабку');
    await closure.next('Внучку');
    await closure.next('Жучку');

    const tale = await closure.next('Кошку');

    expect(tale).toMatch('Кошка 🐱 за жучку, жучка 🐶 за внучку, внучка 👧 за бабку,');
    expect(tale).toMatch(
        'бабка 👵 за дедку, дедка 👴 за репку. Тянут-потянут — вытянуть не могут.'
    );
});

test('Классическая сказка: конец [позвали мышку]', async () => {
    const closure = new DialogTestClosure(repka);

    await closure.next('');
    await closure.next('Бабку');
    const tale = await closure.next('Мышку');

    expect(tale).toMatch(
        'Мышка 🐭 за бабку, бабка 👵 за дедку, дедка 👴 за репку. Тянут-потянут 🎉 вытянули репку!'
    );
});

test('Мужской род зовет на помощь', async () => {
    const closure = new DialogTestClosure(repka);

    await closure.next('');
    expect(await closure.next('Дракона')).toMatch('Кого позвал дракон');
});

test('Женский род зовет на помощь', async () => {
    const closure = new DialogTestClosure(repka);

    await closure.next('');
    expect(await closure.next('Бабку')).toMatch('Кого позвала бабка');
});

test('Средний род зовет на помощь', async () => {
    const closure = new DialogTestClosure(repka);

    await closure.next('');
    expect(await closure.next('Чудище')).toMatch('Кого позвало чудище');
});

test('Сохраняет только героя в творительном падеже', async () => {
    const closure = new DialogTestClosure(repka);

    await closure.next('');
    expect(await closure.next('Бутылка стола дракона')).toMatch('Дракон 🐉 за дедку');
});

test('Предпочтение одушевленным', async () => {
    const closure = new DialogTestClosure(repka);

    await closure.next('');
    expect(await closure.next('Серёжку')).toMatch('Кого позвал сережка');
});

test('Правильно склоняет фразу переспрашивания героя', async () => {
    const closure = new DialogTestClosure(repka);

    await closure.next('');
    await closure.next('внука');
    expect(await closure.next('ракета')).toMatch('Кого позвал внук');

    await closure.next('Бабку');
    expect(await closure.next('ракета')).toMatch('Кого позвала бабка');

    await closure.next('чудище');
    expect(await closure.next('ракета')).toMatch('Кого позвало чудище');
});

test('Принимает персонажа в именительном падеже', async () => {
    const closure = new DialogTestClosure(repka);

    await closure.next('');
    expect(await closure.next('человек')).toMatch('Человек за дедку');
    expect(await closure.next('богатырь')).toMatch('Богатырь за человека');
    expect(await closure.next('Внучок')).toMatch('Внучок за богатыря');
    expect(await closure.next('Царица')).toMatch('Царица за внучка');
    expect(await closure.next('Лебедь')).toMatch('Лебедь 🦢 за царицу');
    // Лебедь - фамилия
    // expect(await closure.handleCommand('Врач')).toMatch('Врач за Лебедь');
});

test('Приоритет вин. падежу', async () => {
    const closure = new DialogTestClosure(repka);

    await closure.next('');
    expect(await closure.next('Тырышкина')).toMatch('Тырышкин за дедку');
});

test('Специальная фраза для рыбки', async () => {
    const closure = new DialogTestClosure(repka);

    await closure.next('');
    expect(await closure.nextTts('золотую рыбку')).toMatch(
        /кликать золотую рыбку.*приплыла к нему рыбка, спросила/
    );

    await closure.next('кошку');
    expect(await closure.next('рыбку')).toMatch('стала она кликать');
});

test('Специальная фраза для кошек', async () => {
    const closure = new DialogTestClosure(repka);

    await closure.next('');
    expect(await closure.nextTts('черную кошку')).toMatch(/Прибежала черная кошка.*вцепилась в дедку/);
    expect(await closure.nextTts('кот мартоскин')).toMatch(/Прибежал кот.*вцепился в/);
});

test('Специальная фраза для мурки', async () => {
    const closure = new DialogTestClosure(repka);

    await closure.next('');
    expect(await closure.nextTts('мурку')).toMatch(/Прибежала кошка мурка/);
});
