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
                    intents: intent ? { [intent]: {slots:{}} } : {},
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

test('Известные персонажи склоняются правильно', async () => {
    const closure = new DialogTestClosure(repka);

    await closure.handleCommand('');

    expect(await closure.handleCommandThenTts('🐺 Серого волка')).toMatch(/Серый волк за дедку/i);
    expect(await closure.handleCommandThenTts('🐦 Ворону')).toMatch(/Ворона за серого волка/i);
    expect(await closure.handleCommandThenTts('🐱 Маленького котёнка')).toMatch(
        /Маленький котенок за ворону/i
    );
    expect(await closure.handleCommandThenTts('🐶 Собаку')).toMatch(
        /Собака за маленького котенка/i
    );
    expect(await closure.handleCommandThenTts('👵 Бабушку')).toMatch(/Бабушка за собаку/i);
    expect(await closure.handleCommandThenTts('🦁 Большого льва')).toMatch(
        /Большой лев за бабушку/i
    );
    expect(await closure.handleCommandThenTts('🐘 Слона')).toMatch(/Слон за большого льва/i);
    expect(await closure.handleCommandThenTts('🐓 Петушка')).toMatch(/Петушок за слона/i);
    expect(await closure.handleCommandThenTts('🦉 Сову')).toMatch(/Сова за петушка/i);
    expect(await closure.handleCommandThenTts('🐔 Курочку')).toMatch(/Курочка за сову/i);
    expect(await closure.handleCommandThenTts('🐻 Бурого мишку')).toMatch(
        /Бурый мишка за курочку/i
    );
    expect(await closure.handleCommandThenTts('🦊 Лисичку')).toMatch(/Лисичка за бурого мишку/i);
    expect(await closure.handleCommandThenTts('🐠 Золотую рыбку')).toMatch(
        /Золотая рыбка за лисичку/i
    );
    expect(await closure.handleCommandThenTts('👧 Внучку')).toMatch(/Внучка за золотую рыбку/i);
    expect(await closure.handleCommandThenTts('👧 Внучка')).toMatch(/Внучка за внучку/i);
    expect(await closure.handleCommandThenTts('🧟‍ Зомби')).toMatch(/Зомби за внучку/i);
    expect(await closure.handleCommandThenTts('👴 Дедушку')).toMatch(/Дедушка за зомби/i);
    expect(await closure.handleCommandThenTts('📱 Алису')).toMatch(/Алиса за дедушку/i);
    expect(await closure.handleCommandThenTts('🧙‍♂️ Гарри Поттер')).toMatch(/Гарри поттер за алису/i);
    expect(await closure.handleCommandThenTts('🐭 Мышку')).toMatch(/Мышка за гарри поттера/i);
});

test('Персонажи с озвучкой 1', async () => {
    const closure = new DialogTestClosure(repka);

    await closure.handleCommand('');

    // prettier-ignore
    for (const char of [
        'внучка','слон', 'собака', 'ворона', 'сова', 'курочка', 'лисичка', 'волк', 'петушок',
        'котик', 'мишка', 'кошка', 'жучка', 'кот', 'дед',  'медведь', 'собачка', 'петух',
        'лев', 'котенок', 'дочка', 'курица', 'рыбка', 'крыса', 'корова', 'крокодил', 'тигр',
    ]) {
        expect(await closure.handleCommandThenTts(char)).toMatch(/<speaker audio/i);
    }
});

test('Персонажи с озвучкой 2', async () => {
    const closure = new DialogTestClosure(repka);

    await closure.handleCommand('');

    // prettier-ignore
    for (const char of [
        'дедушка', 'динозавр',/* 'заяц', 'лиса', 'единорог', 'маша', 'муравей', 'брат', 'дракон', 'колобок', 'попугай',*/
        // 'баба', 'папа', 'мама','алиса', 'бабка', 'бабушка', 'папка', 'рыба', 'зомби', 'девочка', 'как', 'жираф', 'у', 'о', 'внук', 'человек', 'не', 'проститутка', 'котик', 'сосед', 'лягушка', 'бомж', 'бегемот', 'баба', 'бабочка',
        // 'музыка', 'что', 'муха', 'лошадь', 'ш', 'обезьяна', 'дедок', 'сестра', 'акула', 'машина', 'свинья', 'саша', 'вк', 'сын', 'писюн', 'кто', 'таракан', 'халка', 'цыпленок',
        // 'жена', 'кит', 'хотеть', 'птичка', 'черепаха', 'е', 'настя', 'змея', 'б', 'заново', 'кошечка', 'в', 'дура', 'все', 'лунтик', 'youtube', 'катя', 'человек', 'вика', 'червяк',
        // 'ежик', 'телефон', 'мурка', 'хомяк', 'даша', 'секс', 'козел', 'мышонок', 'жук', 'ночка', 'соседка', 'в', 'дед', 'дурак', 'соня', 'член', 'телевизор', 'але', 'паук', 'коза',
        // 'друг', 'сиська', 'зайчик', 'бык', 'робот', 'кролик', 'пися', 'ой', 'инопланетянин', 'аня', 'дурочка', 'мультик', 'комар', 'бог', 'бабуля', 'утка', 'сказка', 'ладно',
        // 'ваня', 'дима', 'попка', 'чебурашка', 'сук', 'стоп', 'муж', 'трамп', 'спасибо', 'внучка', 'так', 'миша', 'лиза', 'мышка', 'мальчик', 'ку', 'да', 'ага', 'ребенок', 'белок',
        // 'хорошо', 'алина', 'пингвин', 'унитаз', 'д', 'енот', 'великан', 'воробей', 'почему', 'русалка', 'игра', 'вонючка', 'микроб', 'дерево', 'ну', 'дом', 'яндекс', 'алкаш',
        // 'гусь', 'вытягивать', 'туалет', 'леди', 'киска', 'гей', 'полина', 'олень', 'лес', 'супермен', 'андрей', 'курочка', 'слово', 'яндекс', 'гарри', 'трактор', 'вася', 'наркоман',
        // 'птица', 'улитка', 'ивангай', 'президент', 'бабка', 'верблюд', 'леопард', 'дельфин', 'конец', 'железный', 'подушка', 'какой', 'картошка', 'себя', 'мыш', 'сосиска', 'сиря',
        // 'никита', 'наташа', 'жопка', 'максим', 'яйцо', 'тетя', 'ксюша', 'повторять', 'медведева', 'таня', 'панда', 'детка', 'красный', 'компьютер', 'снегурочка', 'орел', 'малыш',
        // 'свинка', 'точка', 'бурый', 'пушкин', 'юля', 'дед', 'дядя', 'еще', 'осел', 'бабка', 'где', 'пиписька', 'машка', 'кукушка', 'у', 'артем', 'зайка', 'гопник', 'принцесса', 'фея',
        // 'давать', 'запускать', 'цветок', 'лера', 'говорить', 'носорог', 'скелет', 'кабан', 'щенок', 'лошадка', 'позвать', 'в', 'буратино', 'тимати', 'пикатить', 'зебра', 'щука',
        // 'сначала', 'по', 'крот', 'гусеница', 'моча', 'мамка', 'бэтмена', 'конь', 'голубь', 'монстр', 'овца', 'google', 'божий', 'баран', 'любовница', 'вампир', 'порно', 'шарик',
        // 'лох', '2', 'оля', 'пчела', 'да', 'жучков', 'годзилла', 'свет', 'тянуть', 'блоха', 'давать', 'очко', 'золушка', 'девушка', 'терминатор', 'водка', 'дедка', 'кошка', 'ока',
        // 'пони', 'супер', 'морковка', 'она', 'алена', 'поросенок', 'паша', 'ку', 'король', 'в', 'лена', 'момо', 'солнце', 'сон', 'подруга', 'давать', 'как', 'собака', 'кристина', 'огурец',
        // 'вода', 'осьминог', 'на', 'шкаф', 'жучко', 'кенгуру', 'кузя', 'банан', 'идиот', 'полицейский', 'вова', 'силач', 'диана', 'леша', 'трусы', 'егор', 'ау', 'белый', 'фейс',
        // 'репа', 'слушать', 'вероника', 'вот', 'дочь', 'рысь', 'лисица', 'дедка', 'денис', 'нога', 'влад', 'старуха', 'пердун', 'верить', 'губка', 'бурова', 'я', 'луна', 'сталина',
        // 'ева', 'жаба', 'кукла', 'ольга', 'сказать', 'арина', 'пук', 'кощей', 'кирилл', 'какаха', 'барсик', 'женить', 'танос', 'подсказка', 'варя', 'это', 'сатана', 'козявка', 'егор',
        // 'коля', 'боб', 'погода', 'свинка', 'лупа', 'ангел', 'порошенко', 'зеленский', 'понос', 'гитлер', 'винни', 'бабушка', 'самолет', 'смайлик', 'бабки', 'какашечка', 'милан',
        // 'любовник', 'поставлять', 'снеговик', 'сам', 'тучка', 'елка', 'майнкрафт', 'россия', 'хомячок', 'начинать', 'гренний', 'пес', 'карина', 'конечно', 'горилла', 'страус', 'джин',
        // 'позвать', 'мамочка', 'большой', 'шутка', 'киркоров', 'где', 'сутенер', 'рука', 'аленка', 'ленин', 'мышка', 'придурок', 'включать', 'гепард', 'м', 'сережа', 'внученька', 'данила',
        // 'кузнечик', 'собачка', 'даня', 'быть', 'не', 'обама', 'внучка', 'дональд', 'леший', 'пельмень', 'тихо', 'пожалуйста', 'барби', 'индюк', 'филипп', 'плохо', 'танк', 'носок',
        // 'обезьянка', 'продолжать', 'помидор', 'какашка', 'мы', 'дятел', 'стриптизерша', 'игорь', 'кашка', 'буба', 'змей', 'петя', 'еще', 'ха', 'лось', 'тетка', 'гиппопотам', 'демон',
        // 'стул', 'вытягивать', 'колбаса', 'чиполлин', 'убийца', 'играть', 'ящерица', 'летучий', 'илюша', 'пердушка', 'таджик', 'червячок', 'эльза', 'медуза', 'тупой', 'тор', 'когда',
        // 'черепашка', 'арбуз', 'мочь', 'холодильник', 'глаз', 'полиция', 'позвать', 'петрушка', 'марина', 'яблоко', 'медвежонок', 'эй', 'собака', 'стол', 'давать', 'теща', 'тигренок',
        // 'элджей', 'бутылка', 'лего', 'кошка', 'оса', 'приведение', 'капитан', 'бабка', 'микки', 'белочка', 'ворон', 'хрюшка', 'давать', 'ь', '1', 'маска', 'принц', 'сашка', 'карась',
        // 'жириновский', 'сколько', 'мяу', 'бактерия', 'золотой', 'качка', 'блин', 'подружка', 'ром', 'стрекоза', 'яна', 'кто', 'бузова', 'олег', 'рак', 'киса', 'маленький', 'слайм',
        // 'кошка', 'санс', 'шрек', 'волга', 'пантера', 'деньги', 'клоун', 'че', 'свой', 'капуста', 'ха', 'ира', 'призрак', 'мент', 'кеш', 'ежа', 'молодец', 'девка', 'свой', 'макс',
        // 'директор', 'маруся', 'мама', 'лапка', 'мужик', 'роза', 'богатырь', 'кошка', 'бабко', 'чайник', 'анжела', 'ха', 'братик', 'владик', 'слоник', 'алкоголик', 'сейчас', 'крокодил',
        // 'беззубик', 'машинка', 'окей', 'сися', 'владимир', 'привет', 'кровать', 'песик', 'давать', 'диван', 'бабай', 'доктор', 'видео', 'юра', 'крошить', 'круто', 'рапунцель', 'иван',
        // 'нюша', 'земля', 'он', 'фредди', 'кук', 'сосок', 'валить', 'дима', 'мартышка', 'з', 'валер', 'леха', 'чаек', 'ехать', 'солнышко', 'конфетка', 'бабушка', 'наруто', 'позвать',
        // 'кот', 'учитель', 'ярик', 'лизун', 'малышка', 'олигарх', 'ника', 'школа', 'гигант', 'краб', 'кино', 'маленький', 'елочка', 'даун', 'хрен', 'овечка', 'лисичка', 'лола',
        // 'смерть', 'муся', 'балдить', 'э', 'понимать', 'ульяна', 'серега', 'антон', 'мышка', 'младенец', 'люба', 'букашка', 'ю', 'конец', 'анна', 'мень', 'тема', 'фиксика', 'парень',
        // 'рома', 'бабайка', 'навальный', 'чак', 'ванька', 'бабуся', 'ведьма', 'угу', 'футболист', 'черт', 'лукашенко', 'то', 'тварь', 'жалко', 'идти', 'единорожка', 'звать', 'стриптизер',
        // 'а', 'трансформер', 'нос', 'сыночек', 'русалочка', 'витя', 'оно', 'учительница', 'черепашка', 'солдат', 'цветочек', 'а', 'илья', 'ну', 'часы', 'и', 'ночь', 'червь', 'айфон',
        // 'алеша', 'мамонт', 'пицца', 'миньон', 'наташка', 'руслан', 'дверь', 'синий', 'высоко', 'сестренка', 'ничего', 'слендермен', 'мой', 'пиво', 'рыцарь', 'саня', 'маша', 'море',
        // 'белка', 'одеяло', 'кикимора', 'интернет', 'надя', 'нет', 'конфета', 'дарт', 'медведев', 'костя', '3', 'фу', 'да', 'пегас', 'писюлька', 'бэтмен', 'незнайка', 'слоненок', 'оксана',
        // 'ветка', 'зуб', 'правило', 'смотреть', 'папа', 'женщина', 'игрушка', 'ты', 'далеко', 'пойти', 'печка', 'мороженое', 'стив', 'жвачка', 'куда', 'карандаш', 'илья', 'скорпион',
        // 'автобус', 'к', 'ну', 'лук', 'педофил', 'китаец', 'кака', 'рыбка', 'шалава', 'мир', 'булочка', 'ангелина', 'артур', 'белоснежка', 'бабка', 'титька', 'на', 'ветер', 'бабулька',
        // 'алиса', 'волчонок', 'песня', 'ирина', 'матвей', 'дебилка', 'голова', 'вытягивать', 'сказка', 'хеллоу', 'камень', 'павлин', 'шура', 'скунс', 'вера', 'бабка', 'телка', 'вагин',
        // 'братан', 'тома', 'гриша', 'кощей', 'макака', 'синичка', 'суслик', 'ольга', 'гоша', 'вы', 'ласточка', 'рита', 'титан', 'богдан', 'врач', 'в', 'старушка', 'воробушек', 'негр',
        // 'а', 'филя', 'любовь', 'дьявол', 'лайк', 'лампочка', 'мумия', 'лесбиянка', 'молоко', 'нина', 'батя', 'лева', 'галя', 'тюлень', 'ляля', 'здравствовать', 'мадина', 'нет', 'петька',
        // 'чашка', 'другой', 'велосипед', 'мусор', 'мушка', 'крипер', 'шмель', 'мурзик', 'новый', 'карлсон', 'коробка', 'папочка', 'чупакабер', 'клещ', 'пушка', 'ч', 'не', 'чик', 'спать',
        // 'кира', 'маньяк', 'тракторист', 'кто', 'дашок', 'мука', 'большой', 'владимир', 'утенок', 'находить', 'мошка', 'жар', 'космонавт', 'идти', 'дюймовочка', 'презерватив', 'ютубер',
        // 'давать', 'запускать', 'валера', 'глеб', 'скотина', 'ого', 'кошка', 'лебедь', 'джеки', 'ложка', 'большой', 'спайдермен', 'подождать', 'патрик', 'люцифер', 'супергерой', 'он',
        // 'ждать', 'страна', 'книга', 'запускать', 'музмо', '7', 'жучок', 'р', 'москва', 'горшок', 'ниндзя', 'с', 'да', 'люся', 'суп', 'маринета', 'псина', 'позвать', 'ты', 'пенис',
        // 'тиранозавр', 'пчелка', 'почка', 'марьяна', 'позь', 'повар', 'сыр', 'лепка', 'домовой', 'депутат', 'симка', 'рыжик', 'ножка', 'все', 'река', 'мышь', 'гандон', 'аида', 'клоп',
        // 'экскаватор', 'львица', 'звезда', 'баба', 'дед', 'сумка', 'чебурек', 'алиска', 'жареный', 'пенсия', 'шиншилла', 'книжка', 'не', 'камаз', 'софия', 'слава', 'пришелец', 'радуга',
        // 'черный', 'фокси', 'покемон', 'лисенок', 'пеппа', 'чучело', 'волос', 'смешарик', 'васька', 'снежок', 'н', 'василиса', 'запускать', 'мася', 'морской', 'тик', 'кот', 'бульдозер',
        // 'трава', 'внучок', 'ержан', 'спанч', 'светок', 'эрвин', 'фиксик', 'димка', 'филин', 'вертолет', 'барсук', 'сопля', 'пень', 'он', 'музычка', 'алла', 'ф', 'свой', 'нубика',
    ]) {
        expect(await closure.handleCommandThenTts(char)).toMatch(/<speaker audio/i);
    }
});

test('Кнопки с уже выбранными персонажами не должны приходить повторно', async () => {
    const closure = new DialogTestClosure(repka);

    const shownButtons: { [button: string]: string } = {};

    // Первый вызов кнопки не приходят
    expect((await closure.handleCommandThenResponse('')).buttons).toEqual([]);

    await closure.handleCommand('Сашку');
    let btns = (await closure.handleCommandThenResponse('Пашку')).buttons || [];
    expect(btns).toHaveLength(2);

    while (true) {
        const [first, second] = btns;

        expect(shownButtons).not.toHaveProperty(first.title);
        second && expect(shownButtons).not.toHaveProperty(second.title);

        shownButtons[first.title] = first.title;
        btns = (await closure.handleCommandThenResponse(first.title)).buttons || [];

        if (first.title.match(/мышку/i)) {
            break;
        }
    }
});

test('Вместе с неодушевленным персонажем выводим только две кнопки', async () => {
    const closure = new DialogTestClosure(repka);

    await closure.handleCommand('');
    await closure.handleCommand('котик');

    const { buttons } = await closure.handleCommandThenResponse('стул');

    expect(buttons).toHaveLength(2);
});

/**
 * Часто в самом начале игры люди вместо того, чтобы назвать персонажа,
 * отвечают на вопрос "Хотите поиграть…" и говорят "Да"
 */
test('При фразе «Да» повторяет призыв персонажа', async () => {
    const closure = new DialogTestClosure(repka);

    await closure.handleCommand('');
    const answer = await closure.handleIntent('YANDEX.CONFIRM');

    expect(answer).not.toMatch(/не похоже/i);
    expect(answer).toMatch(/кого позвал дедка/i);
});

test('Выводит помощь на фразы «никого», «не знаю»', async () => {
    const closure = new DialogTestClosure(repka);

    await closure.handleCommand('');

    expect(await closure.handleCommand('никого')).not.toMatch(/не похоже/i);
    expect(await closure.handleCommand('не знаю')).not.toMatch(/не похоже/i);

    expect(await closure.handleCommand('никого')).toMatch(/можете позвать любого персонажа/i);
    expect(await closure.handleCommand('не знаю')).toMatch(/можете позвать любого персонажа/i);
});
