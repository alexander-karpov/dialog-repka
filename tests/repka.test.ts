import { repka } from '../src/repka';
import { Dialog } from '../src/DialogBuilder/Dialog';
import { DialogResponse } from '../src/DialogBuilder/DialogResponse';

class DialogTestClosure<TState, TSceneId> {
    private state!: TState;

    constructor(private readonly dialog: Dialog<TState, TSceneId>) {}

    async handleCommand(command: string): Promise<string> {
        return (await this.handleRequest(command)).response.text;
    }

    async handleIntent(intent: string): Promise<string> {
        return (await this.handleRequest('', intent)).response.text;
    }

    async handleCommandThenTts(command: string): Promise<string | undefined> {
        return (await this.handleRequest(command)).response.tts;
    }

    async handleCommandThenResponse(command: string) {
        return (await this.handleRequest(command)).response;
    }

    private async handleRequest(command: string, intent?: string): Promise<DialogResponse> {
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
                    intents: intent ? { [intent]: true } : {},
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

    expect(await closure.handleCommand('')).toMatch(/посадил дед репку/i);
});

test('Классическая сказка: история', async () => {
    const closure = new DialogTestClosure(repka);

    await closure.handleCommand('');
    await closure.handleCommand('Бабку');
    await closure.handleCommand('Внучку');
    await closure.handleCommand('Жучку');

    const tale = await closure.handleCommand('Кошку');

    expect(tale).toMatch('Кошка 🐱 за жучку, жучка 🐶 за внучку, внучка 👧 за бабку,');
    expect(tale).toMatch(
        'бабка 👵 за дедку, дедка 👴 за репку. Тянут-потянут — вытянуть не могут.'
    );
});

test('Классическая сказка: конец [позвали мышку]', async () => {
    const closure = new DialogTestClosure(repka);

    await closure.handleCommand('');
    await closure.handleCommand('Бабку');
    const tale = await closure.handleCommand('Мышку');

    expect(tale).toMatch(
        'Мышка 🐭 за бабку, бабка 👵 за дедку, дедка 👴 за репку. Тянут-потянут 🎉 вытянули репку!'
    );
});

test('Мужской род зовет на помощь', async () => {
    const closure = new DialogTestClosure(repka);

    await closure.handleCommand('');
    expect(await closure.handleCommand('Дракона')).toMatch('Кого позвал дракон');
});

test('Женский род зовет на помощь', async () => {
    const closure = new DialogTestClosure(repka);

    await closure.handleCommand('');
    expect(await closure.handleCommand('Бабку')).toMatch('Кого позвала бабка');
});

test('Средний род зовет на помощь', async () => {
    const closure = new DialogTestClosure(repka);

    await closure.handleCommand('');
    expect(await closure.handleCommand('Чудище')).toMatch('Кого позвало чудище');
});

test('Сохраняет только героя в творительном падеже', async () => {
    const closure = new DialogTestClosure(repka);

    await closure.handleCommand('');
    expect(await closure.handleCommand('Бутылка стола дракона')).toMatch('Дракон 🐉 за дедку');
});

test('Предпочтение одушевленным', async () => {
    const closure = new DialogTestClosure(repka);

    await closure.handleCommand('');
    expect(await closure.handleCommand('Серёжку')).toMatch('Кого позвал сережка');
});

test('Правильно склоняет фразу переспрашивания героя', async () => {
    const closure = new DialogTestClosure(repka);

    await closure.handleCommand('');
    await closure.handleCommand('внука');
    expect(await closure.handleCommand('ракета')).toMatch('Кого позвал внук');

    await closure.handleCommand('Бабку');
    expect(await closure.handleCommand('ракета')).toMatch('Кого позвала бабка');

    await closure.handleCommand('чудище');
    expect(await closure.handleCommand('ракета')).toMatch('Кого позвало чудище');
});

test('Принимает персонажа в именительном падеже', async () => {
    const closure = new DialogTestClosure(repka);

    await closure.handleCommand('');
    expect(await closure.handleCommand('человек')).toMatch('Человек за дедку');
    expect(await closure.handleCommand('богатырь')).toMatch('Богатырь за человека');
    expect(await closure.handleCommand('Внучок')).toMatch('Внучок за богатыря');
    expect(await closure.handleCommand('Царица')).toMatch('Царица за внучка');
    expect(await closure.handleCommand('Лебедь')).toMatch('Лебедь 🦢 за царицу');
    // Лебедь - фамилия
    // expect(await closure.handleCommand('Врач')).toMatch('Врач за Лебедь');
});

test('Приоритет вин. падежу', async () => {
    const closure = new DialogTestClosure(repka);

    await closure.handleCommand('');
    expect(await closure.handleCommand('Тырышкина')).toMatch('Тырышкин за дедку');
});

test('Специальная фраза для рыбки', async () => {
    const closure = new DialogTestClosure(repka);

    await closure.handleCommand('');
    expect(await closure.handleCommandThenTts('золотую рыбку')).toMatch(
        /кликать золотую рыбку.*приплыла к нему рыбка, спросила/
    );

    await closure.handleCommand('кошку');
    expect(await closure.handleCommand('рыбку')).toMatch('стала она кликать');
});

test('Специальная фраза для кошек', async () => {
    const closure = new DialogTestClosure(repka);

    await closure.handleCommand('');
    expect(await closure.handleCommandThenTts('черную кошку')).toMatch(
        /Прибежала черная кошка.*вцепилась в дедку/
    );
    expect(await closure.handleCommandThenTts('кот мартоскин')).toMatch(/Прибежал кот.*вцепился в/);
});

test('Специальная фраза для мурки', async () => {
    const closure = new DialogTestClosure(repka);

    await closure.handleCommand('');
    expect(await closure.handleCommandThenTts('мурку')).toMatch(/Прибежала кошка мурка/);
});

test('Отбрасывает неодушевленное специальной фразой', async () => {
    const closure = new DialogTestClosure(repka);

    await closure.handleCommand('');
    expect(await closure.handleCommand('лопату')).toMatch(/звал дедка лопату.*не дозвался/);
    expect(await closure.handleCommand('ведро')).toMatch(/звал дедка ведро.*не дозвался/);
    expect(await closure.handleCommand('чайник')).toMatch(/звал дедка чайник.*не дозвался/);
    expect(await closure.handleCommand('окно')).toMatch(/звал дедка окно.*не дозвался/);
});

test('что ты умеешь / помощь', async () => {
    const closure = new DialogTestClosure(repka);

    await closure.handleCommand('');
    expect(await closure.handleIntent('YANDEX.WHAT_CAN_YOU_DO')).toMatch('вместе сочиним сказку');

    await closure.handleCommand('кошку');
    expect(await closure.handleIntent('YANDEX.HELP')).toMatch(/Кого позвала кошка?/i);
});

test('Повтор истории: подтверждение', async () => {
    const closure = new DialogTestClosure(repka);

    await closure.handleCommand('');

    expect(await closure.handleCommand('мышку')).toMatch('вытянули репку');
    expect(await closure.handleIntent('YANDEX.CONFIRM')).toMatch('Посадил дед репку');

    expect(await closure.handleCommand('мышку')).toMatch('вытянули репку');
    expect(await closure.handleCommand('давай еще раз')).toMatch('Посадил дед репку');

    expect(await closure.handleCommand('мышку')).toMatch('вытянули репку');
    expect(await closure.handleCommand('сначала')).toMatch('Посадил дед репку');
});

test('Отказ от продолжения словом Не надо', async () => {
    const closure = new DialogTestClosure(repka);

    await closure.handleCommand('');
    await closure.handleCommand('мышку');
    expect(await closure.handleIntent('YANDEX.REJECT')).toMatch('конец');

    const closure2 = new DialogTestClosure(repka);
    await closure.handleCommand('');
    await closure.handleCommand('мышку');
    expect(await closure.handleCommand('больше не надо пожалуйста')).toMatch('конец');
});

test('Позвали лошадь (регрессия)', async () => {
    const closure = new DialogTestClosure(repka);

    await closure.handleCommand('');
    expect(await closure.handleCommand('лошадь')).toMatch('Лошадь 🐴 за дедку');
    expect(await closure.handleCommand('лошадь')).toMatch('Лошадь 🐴 за лошадь');
});

test('Для имен неопред. рода выбирается мужской', async () => {
    const closure = new DialogTestClosure(repka);

    await closure.handleCommand('');
    expect(await closure.handleCommand('сашу')).toMatch('Кого позвал саша');
});

test('Принимает имя-фамилию', async () => {
    const closure = new DialogTestClosure(repka);

    await closure.handleCommand('');
    expect(await closure.handleCommand('александра карпова')).toMatch(
        /Александр Карпов за дедку,/i
    );
    expect(await closure.handleCommand('ирина карпова')).toMatch(
        /Ирина Карпова за Александра Карпова,/i
    );
    expect(await closure.handleCommand('владимир путин')).toMatch(
        /Владимир Путин за Ирину Карпову,/i
    );
    expect(await closure.handleCommandThenTts('гарри поттер')).toMatch(
        /Гарри Поттер за Владимира Путина /i
    );
    expect(await closure.handleCommand('фёдор емельяненко')).toMatch(
        /Федор Емельяненко за Гарри Поттера,/i
    );
    expect(await closure.handleCommand('аллу пугачёву')).toMatch(
        /Алла Пугачева за Федора Емельяненко,/i
    );
});

test('Принимает прилагательное-существительное', async () => {
    const closure = new DialogTestClosure(repka);

    await closure.handleCommand('');
    expect(await closure.handleCommand('железного человека')).toMatch('Железный человек за дедку');
    expect(await closure.handleCommand('маленькую кошечку')).toMatch(
        'Маленькая кошечка 🐱 за железного человека,'
    );
    expect(await closure.handleCommand('черную кошку')).toMatch(
        'Черная кошка 🐱 за маленькую кошечку,'
    );
    expect(await closure.handleCommand('летний зайчик')).toMatch(
        'Летний зайчик 🐰 за черную кошку,'
    );
    expect(await closure.handleCommand('летнюю пчелку')).toMatch(
        'Летняя пчелка 🐝 за летнего зайчика,'
    );
    expect(await closure.handleCommand('зверя')).toMatch('Зверь за летнюю пчелку,');
});

test('Любого персонажа вин. падежа предпочитает Имени-Фамилии им. падежа', async () => {
    const closure = new DialogTestClosure(repka);

    await closure.handleCommandThenTts('');
    expect(await closure.handleCommandThenTts('позвал Вася Пупкин котика')).toMatch(
        /котик за дедку/i
    );
});

test('Распознает Имя-Фамилия когда имя неопределенного пола', async () => {
    const closure = new DialogTestClosure(repka);

    await closure.handleCommand('');
    expect(await closure.handleCommand('Саша Карпов')).toMatch(/Саша Карпов за дедку/i);
});

test('Очень короткие слова в вин. падеже.', async () => {
    const closure = new DialogTestClosure(repka);

    await closure.handleCommand('');
    expect(await closure.handleCommand('пса')).toMatch('Пес за дедку');
    expect(await closure.handleCommand('льва')).toMatch('Лев 🦁 за пса');
    expect(await closure.handleCommand('котика')).toMatch('Котик 🐱 за льва');

    expect(await closure.handleCommand('пес')).toMatch('Пес за котика');
    expect(await closure.handleCommand('лев')).toMatch('Лев 🦁 за пса');
    expect(await closure.handleCommand('котик')).toMatch('Котик 🐱 за льва');
});

test('Повтор истории: отказ', async () => {
    const closure = new DialogTestClosure(repka);

    await closure.handleCommand('');

    expect(await closure.handleCommand('мышку')).toMatch('вытянули репку');
    const { end_session, text } = await closure.handleCommandThenResponse('нет спасибо');

    expect(text).toMatch('конец');
    expect(end_session).toEqual(true);
});

test('Спецфраза для жучки', async () => {
    const closure = new DialogTestClosure(repka);

    await closure.handleCommand('');
    expect(await closure.handleCommand('жучку')).toMatch(/^Прибежала жучка\. Жучка 🐶 за дедку/);
});

test('Позвали буратино, пиноккио', async () => {
    const closure = new DialogTestClosure(repka);

    await closure.handleCommand('');
    expect(await closure.handleCommand('буратино')).toMatch('Буратино за дедку');
    expect(await closure.handleCommand('пиноккио')).toMatch('Пиноккио за буратино,');
    expect(await closure.handleCommand('котик')).toMatch('Котик 🐱 за пиноккио,');
});

test('Распознает множ. число как ед.', async () => {
    const closure = new DialogTestClosure(repka);

    await closure.handleCommand('');
    expect(await closure.handleCommand('кошек')).toMatch('Кошка 🐱 за дедку');
    expect(await closure.handleCommand('котята')).toMatch('Котенок 🐱 за кошку');
});

test('Позвали осла', async () => {
    const closure = new DialogTestClosure(repka);

    await closure.handleCommand('');
    expect(await closure.handleCommand('осла')).toMatch('Осел за дедку');
    expect(await closure.handleCommand('котика')).toMatch('Котик 🐱 за осла,');
});

test('Позвали гонца', async () => {
    const closure = new DialogTestClosure(repka);

    await closure.handleCommand('');
    expect(await closure.handleCommand('гонца')).toMatch('Гонец за дедку');
    expect(await closure.handleCommand('котика')).toMatch('Котик 🐱 за гонца,');
});

test('Чёрный ворон не заменяется на ворону', async () => {
    const closure = new DialogTestClosure(repka);

    await closure.handleCommand('');
    expect(await closure.handleCommandThenTts('чёрного ворона')).toMatch(
        /Прилетел черный ворон .*черный ворон за/i
    );
    expect(await closure.handleCommandThenTts('чёрный ворон')).toMatch(
        /Прилетел черный ворон .*черный ворон за/i
    );
});

test('Не склоняет неод. сущности', async () => {
    const closure = new DialogTestClosure(repka);

    await closure.handleCommand('');
    expect(await closure.handleCommandThenTts('замок')).toMatch(/звал дедка замок/i);
});

test('Правильно склоняет милых коней', async () => {
    const closure = new DialogTestClosure(repka);

    await closure.handleCommand('');
    expect(await closure.handleCommand('милые кони')).toMatch(/милый конь 🐴 за дедку/i);
    expect(await closure.handleCommand('милые кони')).toMatch(/милый конь 🐴 за милого коня/i);
});

test('В конце концов распоздавать сущ. в любом падеже', async () => {
    const closure = new DialogTestClosure(repka);

    await closure.handleCommand('');
    expect(await closure.handleCommandThenTts('мальчику')).toMatch(/мальчик за дедку/i);
});

test('Чернила - неодущевленная сущность', async () => {
    const closure = new DialogTestClosure(repka);

    await closure.handleCommand('');
    expect(await closure.handleCommandThenTts('чернила')).toMatch(/звал дедка чернила/i);
});

test('Распознает персонажа из двук существительных', async () => {
    const closure = new DialogTestClosure(repka);

    await closure.handleCommand('');
    expect(await closure.handleCommand('бабу ягу')).toMatch(/баба яга 🧙‍ за дедку/i);
    expect(await closure.handleCommand('деда мороза')).toMatch(/дед мороз 🎅 за бабу ягу/i);
    expect(await closure.handleCommand('человека паука')).toMatch(/человек паук за деда мороза/i);
    expect(await closure.handleCommand('капитан америка')).toMatch(
        /капитан америка за человека паука/i
    );

    expect(await closure.handleCommand('дед бабу')).toMatch(/баба 👵 за капитана америку/i);
    expect(await closure.handleCommand('баба деда дудка')).toMatch(/дед 👴 за бабу/i);
    expect(await closure.handleCommand('холод стул')).toMatch(/долго звал дед холод/i);
});

test('Не принимает два существительныз разного пола', async () => {
    const closure = new DialogTestClosure(repka);

    await closure.handleCommand('');
    expect(await closure.handleCommand('Собака красный')).toMatch(/собака 🐶 за дедку/i);
});

test('Отбрасывает С', async () => {
    const closure = new DialogTestClosure(repka);

    await closure.handleCommand('');
    expect(await closure.handleCommand('Дурачка с переулочка')).toMatch(/дурачок за дедку/i);
});

test('Отбрасывает повторение одного слова (такое случайно бывает)', async () => {
    const closure = new DialogTestClosure(repka);

    await closure.handleCommand('');
    expect(await closure.handleCommand('Чебурашку чебурашку')).toMatch(/^Чебурашка за дедку/i);
});

test('Распознание ответов Да и Нет не чуствительно к регистру', async () => {
    const closure = new DialogTestClosure(repka);

    await closure.handleCommand('');
    await closure.handleCommand('Мышку');
    expect(await closure.handleCommand('Заново')).toMatch(/посадил дед репку/i);
});

test('Принимает За зайцем (регрессия)', async () => {
    const closure = new DialogTestClosure(repka);

    await closure.handleCommand('');
    expect(await closure.handleCommandThenTts('за зайцем')).toMatch(/заяц за дедку/i);
});

// test('История заканчивается когда становится очень длинной', async () => {
//     const closure = new DialogTestClosure(repka);

//     let tale = (await closure.handleCommandThenTts('')) || '';

//     while (tale.length < 1024 && !/вытянули репку/i.test(tale)) {
//         const closure = new DialogTestClosure(repka);

//         tale = (await closure.handleCommandThenTts('маленького коненка')) || '';
//     }

//     expect(tale).toMatch(/вытянули репку/i);
// });

test('Игнорирует эмоджи в команде', async () => {
    const closure = new DialogTestClosure(repka);

    await closure.handleCommandThenTts('');
    expect(await closure.handleCommandThenTts('🐺 Серого волка')).toMatch(/серый волк/i);
});

test('Исправляет известные особенности распознавания речи', async () => {
    const closure = new DialogTestClosure(repka);

    await closure.handleCommand('');
    expect(await closure.handleCommand('позвал сучку')).toMatch(/жучка 🐶 за дедку/i);
    expect(await closure.handleCommand('позвал баку')).toMatch(/бабка 👵 за жучку/i);
    expect(await closure.handleCommand('позвал жучка')).toMatch(/жучка 🐶 за бабку/i);
    expect(await closure.handleCommand('позвал ручку')).toMatch(/жучка 🐶 за жучку/i);
    expect(await closure.handleCommand('позвал ночку')).toMatch(/дочка 🧒 за жучку/i);
});

test('Не распознаёт слово «нет» как часть персонажа', async () => {
    const closure = new DialogTestClosure(repka);

    await closure.handleCommandThenTts('');
    expect(await closure.handleCommandThenTts('Котик нет')).toMatch(/котик за дедку/i);
});

test('Исправляет tts для жучки', async () => {
    const closure = new DialogTestClosure(repka);

    await closure.handleCommandThenTts('');
    expect(await closure.handleCommandThenTts('Жучка')).toMatch(/ж\+учка/i);
});

test('Распознаёт «огромную преогромную сильные сову»', async () => {
    const closure = new DialogTestClosure(repka);

    await closure.handleCommandThenTts('');
    expect(await closure.handleCommandThenTts('позвал огромную преогромную сильные сову')).toMatch(
        /сильная сова/i
    );
});

test('Распознаёт несогласованные прил. и сущ.', async () => {
    const closure = new DialogTestClosure(repka);

    await closure.handleCommandThenTts('');
    await closure.handleCommandThenTts('маленький гордый птица');

    expect(await closure.handleCommandThenTts('маленький гордый птица')).toMatch(
        /маленькая гордая птица за маленькую гордую птицу /i
    );
});

test('Не распознаёт «пришла» как пришлая', async () => {
    const closure = new DialogTestClosure(repka);

    await closure.handleCommand('');

    expect(await closure.handleCommand('пришла бабушка')).toMatch(/^Пришла бабушка/i);
});

test('Распознаёт «детка» как «дедка», а не  «дедок»', async () => {
    const closure = new DialogTestClosure(repka);

    await closure.handleCommand('');

    expect(await closure.handleCommand('детка')).toMatch(/дедка 👴 за дедку/i);
});
