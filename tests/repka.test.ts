import { repka } from '../src/repka/repka';
import { TestClosure } from '../src/DialogBuilder2';
import { RepkaSceneName } from '../src/repka/RepkaSceneName';
import { RepkaModel } from '../src/repka/RepkaModel';

let closure: TestClosure<RepkaSceneName, RepkaModel>;

async function text(command: string, intent?: string) {
    const response = await (intent
        ? closure.handleIntent(intent)
        : closure.handleCommand(command));

    return response.text;
}

async function tts(command: string, intent?: string) {
    const response = await (intent
        ? closure.handleIntent(intent)
        : closure.handleCommand(command));

    return response.tts;
}

beforeEach(() => {
    closure = new TestClosure(repka);
});

test('Классическая сказка: начало', async () => {
    expect(await text('')).toMatch(/посадил дед репку/i);
});

test('Классическая сказка: история', async () => {
    await text('');
    await text('Бабку');
    await text('Внучку');
    await text('Жучку');

    const tale = await text('Кошку');

    expect(tale).toMatch('Кошка 🐱 за жучку, жучка 🐶 за внучку, внучка 👧 за бабку,');
    expect(tale).toMatch(
        'бабка 👵 за дедку, дедка 👴 за репку. Тянут-потянут — вытянуть не могут.'
    );
});

test('Классическая сказка: конец [позвали мышку]', async () => {
    await text('');
    await text('Бабку');
    const tale = await text('Мышку');

    expect(tale).toMatch(
        'Мышка 🐭 за бабку, бабка 👵 за дедку, дедка 👴 за репку. Тянут-потянут 🎉 вытянули репку!'
    );
});

test('Мужской род зовет на помощь', async () => {
    await text('');
    expect(await text('Дракона')).toMatch('Кого позвал дракон');
});

test('Женский род зовет на помощь', async () => {
    await text('');
    expect(await text('Бабку')).toMatch('Кого позвала бабка');
});

test('Средний род зовет на помощь', async () => {
    await text('');
    expect(await text('Чудище')).toMatch('Кого позвало чудище');
});

test('Сохраняет только героя в творительном падеже', async () => {
    await text('');
    expect(await text('Бутылка стола дракона')).toMatch('Дракон 🐉 за дедку');
});

test('Предпочтение одушевленным', async () => {
    await text('');
    expect(await text('Серёжку')).toMatch('Кого позвал сережка');
});

test('Правильно склоняет фразу переспрашивания героя', async () => {
    await text('');
    await text('внука');
    expect(await text('ракета')).toMatch('Кого позвал внук');

    await text('Бабку');
    expect(await text('ракета')).toMatch('Кого позвала бабка');

    await text('чудище');
    expect(await text('ракета')).toMatch('Кого позвало чудище');
});

test('Принимает персонажа в именительном падеже', async () => {
    await text('');
    expect(await text('человек')).toMatch('Человек за дедку');
    expect(await text('богатырь')).toMatch('Богатырь за человека');
    expect(await text('Внучок')).toMatch('Внучок за богатыря');
    expect(await text('Царица')).toMatch('Царица за внучка');
    expect(await text('Лебедь')).toMatch('Лебедь 🦢 за царицу');
    // Лебедь - фамилия
    // expect(await text('Врач')).toMatch('Врач за Лебедь');
});

test('Приоритет вин. падежу', async () => {
    await text('');
    expect(await text('Тырышкина')).toMatch('Тырышкин за дедку');
});

test('Специальная фраза для рыбки', async () => {
    await text('');
    expect(await tts('золотую рыбку')).toMatch(
        /кликать золотую рыбку.*приплыла к нему рыбка, спросила/
    );

    await text('кошку');
    expect(await text('рыбку')).toMatch('стала она кликать');
});

test('Специальная фраза для кошек', async () => {
    await text('');
    expect(await tts('черную кошку')).toMatch(/Прибежала черная кошка.*вцепилась в дедку/);
    expect(await tts('кот мартоскин')).toMatch(/Прибежал кот.*вцепился в/);
});

test('Специальная фраза для мурки', async () => {
    await text('');
    expect(await tts('мурку')).toMatch(/Прибежала кошка мурка/);
});

test('Отбрасывает неодушевленное специальной фразой', async () => {
    await text('');
    expect(await text('лопату')).toMatch(/звал дедка лопату.*не дозвался/);
    expect(await text('ведро')).toMatch(/звал дедка ведро.*не дозвался/);
    expect(await text('чайник')).toMatch(/звал дедка чайник.*не дозвался/);
    expect(await text('окно')).toMatch(/звал дедка окно.*не дозвался/);
});

test('что ты умеешь / помощь', async () => {
    await text('');
    expect(await text('', 'YANDEX.WHAT_CAN_YOU_DO')).toMatch('вместе сочиним сказку');

    await text('кошку');
    expect(await text('', 'YANDEX.HELP')).toMatch(/Кого позвала кошка?/i);
});

test('Повтор истории: подтверждение', async () => {
    await text('');

    expect(await text('мышку')).toMatch('вытянули репку');
    expect(await text('', 'YANDEX.CONFIRM')).toMatch('Посадил дед репку');

    expect(await text('мышку')).toMatch('вытянули репку');
    expect(await text('давай еще раз')).toMatch('Посадил дед репку');

    expect(await text('мышку')).toMatch('вытянули репку');
    expect(await text('сначала')).toMatch('Посадил дед репку');
});

test('Отказ от продолжения словом Не надо', async () => {
    await text('');
    await text('мышку');
    expect(await text('', 'YANDEX.REJECT')).toMatch('конец');

    const closure2 = new TestClosure(repka);
    await text('');
    await text('мышку');
    expect(await text('больше не надо пожалуйста')).toMatch('конец');
});

test('Позвали лошадь (регрессия)', async () => {
    await text('');
    expect(await text('лошадь')).toMatch('Лошадь 🐴 за дедку');
    expect(await text('лошадь')).toMatch('Лошадь 🐴 за лошадь');
});

test('Для имен неопред. рода выбирается мужской', async () => {
    await text('');
    expect(await text('сашу')).toMatch('Кого позвал саша');
});

test('Принимает имя-фамилию', async () => {
    await text('');
    expect(await text('александра карпова')).toMatch(/Александр Карпов за дедку,/i);
    expect(await text('ирина карпова')).toMatch(/Ирина Карпова за Александра Карпова,/i);
    expect(await text('владимир путин')).toMatch(/Владимир Путин за Ирину Карпову,/i);
    expect(await tts('гарри поттер')).toMatch(/Гарри Поттер за Владимира Путина /i);
    expect(await text('фёдор емельяненко')).toMatch(/Федор Емельяненко за Гарри Поттера,/i);
    expect(await text('аллу пугачёву')).toMatch(/Алла Пугачева за Федора Емельяненко,/i);
});

test('Принимает прилагательное-существительное', async () => {
    await text('');
    expect(await text('железного человека')).toMatch('Железный человек за дедку');
    expect(await text('маленькую кошечку')).toMatch('Маленькая кошечка 🐱 за железного человека,');
    expect(await text('черную кошку')).toMatch('Черная кошка 🐱 за маленькую кошечку,');
    expect(await text('летний зайчик')).toMatch('Летний зайчик 🐰 за черную кошку,');
    expect(await text('летнюю пчелку')).toMatch('Летняя пчелка 🐝 за летнего зайчика,');
    expect(await text('зверя')).toMatch('Зверь за летнюю пчелку,');
});

test('Любого персонажа вин. падежа предпочитает Имени-Фамилии им. падежа', async () => {
    await tts('');
    expect(await tts('позвал Вася Пупкин котика')).toMatch(/котик за дедку/i);
});

test('Распознает Имя-Фамилия когда имя неопределенного пола', async () => {
    await text('');
    expect(await text('Саша Карпов')).toMatch(/Саша Карпов за дедку/i);
});

test('Очень короткие слова в вин. падеже.', async () => {
    await text('');
    expect(await text('пса')).toMatch('Пес за дедку');
    expect(await text('льва')).toMatch('Лев 🦁 за пса');
    expect(await text('котика')).toMatch('Котик 🐱 за льва');

    expect(await text('пес')).toMatch('Пес за котика');
    expect(await text('лев')).toMatch('Лев 🦁 за пса');
    expect(await text('котик')).toMatch('Котик 🐱 за льва');
});

test('Повтор истории: отказ', async () => {
    await text('');

    expect(await text('мышку')).toMatch('вытянули репку');
    const { end_session, text: text_ } = await closure.handleCommand('нет спасибо');

    expect(text_).toMatch('конец');
    expect(end_session).toEqual(true);
});

test('Спецфраза для жучки', async () => {
    await text('');
    expect(await text('жучку')).toMatch(/^Прибежала жучка\. Жучка 🐶 за дедку/);
});

test('Позвали буратино, пиноккио', async () => {
    await text('');
    expect(await text('буратино')).toMatch('Буратино за дедку');
    expect(await text('пиноккио')).toMatch('Пиноккио за буратино,');
    expect(await text('котик')).toMatch('Котик 🐱 за пиноккио,');
});

test('Распознает множ. число как ед.', async () => {
    await text('');
    expect(await text('кошек')).toMatch('Кошка 🐱 за дедку');
    expect(await text('котята')).toMatch('Котенок 🐱 за кошку');
});

test('Позвали осла', async () => {
    await text('');
    expect(await text('осла')).toMatch('Осел за дедку');
    expect(await text('котика')).toMatch('Котик 🐱 за осла,');
});

test('Позвали гонца', async () => {
    await text('');
    expect(await text('гонца')).toMatch('Гонец за дедку');
    expect(await text('котика')).toMatch('Котик 🐱 за гонца,');
});

test('Чёрный ворон не заменяется на ворону', async () => {
    await text('');
    expect(await tts('чёрного ворона')).toMatch(/Прилетел черный ворон .*черный ворон за/i);
    expect(await tts('чёрный ворон')).toMatch(/Прилетел черный ворон .*черный ворон за/i);
});

test('Не склоняет неод. сущности', async () => {
    await text('');
    expect(await tts('замок')).toMatch(/звал дедка замок/i);
});

test('Правильно склоняет милых коней', async () => {
    await text('');
    expect(await text('милые кони')).toMatch(/милый конь 🐴 за дедку/i);
    expect(await text('милые кони')).toMatch(/милый конь 🐴 за милого коня/i);
});

test('В конце концов распоздавать сущ. в любом падеже', async () => {
    await text('');
    expect(await tts('мальчику')).toMatch(/мальчик за дедку/i);
});

test('Чернила - неодущевленная сущность', async () => {
    await text('');
    expect(await tts('чернила')).toMatch(/звал дедка чернила/i);
});

test('Распознает персонажа из двук существительных', async () => {
    await text('');
    expect(await text('бабу ягу')).toMatch(/баба яга 🧙‍ за дедку/i);
    expect(await text('деда мороза')).toMatch(/дед мороз 🎅 за бабу ягу/i);
    expect(await text('человека паука')).toMatch(/человек паук за деда мороза/i);
    expect(await text('капитан америка')).toMatch(/капитан америка за человека паука/i);

    expect(await text('дед бабу')).toMatch(/баба 👵 за капитана америку/i);
    expect(await text('баба деда дудка')).toMatch(/дед 👴 за бабу/i);
    expect(await text('холод стул')).toMatch(/долго звал дед холод/i);
});

test('Не принимает два существительныз разного пола', async () => {
    await text('');
    expect(await text('Собака красный')).toMatch(/собака 🐶 за дедку/i);
});

test('Отбрасывает С', async () => {
    await text('');
    expect(await text('Дурачка с переулочка')).toMatch(/дурачок за дедку/i);
});

test('Отбрасывает повторение одного слова (такое случайно бывает)', async () => {
    await text('');
    expect(await text('Чебурашку чебурашку')).toMatch(/^Чебурашка за дедку/i);
});

test('Распознание ответов Да и Нет не чуствительно к регистру', async () => {
    await text('');
    await text('Мышку');
    expect(await text('Заново')).toMatch(/посадил дед репку/i);
});

test('Принимает За зайцем (регрессия)', async () => {
    await text('');
    expect(await tts('за зайцем')).toMatch(/заяц за дедку/i);
});

// test('История заканчивается когда становится очень длинной', async () => {
//     const closure = new DialogTestClosure(repka);

//     let tale = (await tts('')) || '';

//     while (tale.length < 1024 && !/вытянули репку/i.test(tale)) {
//         const closure = new DialogTestClosure(repka);

//         tale = (await tts('маленького коненка')) || '';
//     }

//     expect(tale).toMatch(/вытянули репку/i);
// });

test('Игнорирует эмоджи в команде', async () => {
    await tts('');
    expect(await tts('🐺 Серого волка')).toMatch(/серый волк/i);
});

test('Исправляет известные особенности распознавания речи', async () => {
    await text('');
    expect(await text('позвал сучку')).toMatch(/жучка 🐶 за дедку/i);
    expect(await text('позвал баку')).toMatch(/бабка 👵 за жучку/i);
    expect(await text('позвал жучка')).toMatch(/жучка 🐶 за бабку/i);
    expect(await text('позвал ручку')).toMatch(/жучка 🐶 за жучку/i);
    expect(await text('позвал ночку')).toMatch(/дочка 🧒 за жучку/i);
});

test('Не распознаёт слово «нет» как часть персонажа', async () => {
    await tts('');
    expect(await tts('Котик нет')).toMatch(/котик за дедку/i);
});

test('Исправляет tts для жучки', async () => {
    await tts('');
    expect(await tts('Жучка')).toMatch(/ж\+учка/i);
});

test('Распознаёт «огромную преогромную сильные сову»', async () => {
    await tts('');
    expect(await tts('позвал огромную преогромную сильные сову')).toMatch(/сильная сова/i);
});

test('Распознаёт несогласованные прил. и сущ.', async () => {
    await tts('');
    await tts('маленький гордый птица');

    expect(await tts('маленький гордый птица')).toMatch(
        /маленькая гордая птица за маленькую гордую птицу /i
    );
});

test('Не распознаёт «пришла» как пришлая', async () => {
    await text('');

    expect(await text('пришла бабушка')).toMatch(/^Пришла бабушка/i);
});

test('Распознаёт «детка» как «дедка», а не  «дедок»', async () => {
    await text('');

    expect(await text('детка')).toMatch(/дедка 👴 за дедку/i);
});

test('Известные персонажи склоняются правильно', async () => {
    await text('');

    expect(await tts('🐺 Серого волка')).toMatch(/Серый волк за дедку/i);
    expect(await tts('🐦 Ворону')).toMatch(/Ворона за серого волка/i);
    expect(await tts('🐱 Маленького котёнка')).toMatch(/Маленький котенок за ворону/i);
    expect(await tts('🐶 Собаку')).toMatch(/Собака за маленького котенка/i);
    expect(await tts('👵 Бабушку')).toMatch(/Бабушка за собаку/i);
    expect(await tts('🦁 Большого льва')).toMatch(/Большой лев за бабушку/i);
    expect(await tts('🐘 Слона')).toMatch(/Слон за большого льва/i);
    expect(await tts('🐓 Петушка')).toMatch(/Петушок за слона/i);
    expect(await tts('🦉 Сову')).toMatch(/Сова за петушка/i);
    expect(await tts('🐔 Курочку')).toMatch(/Курочка за сову/i);
    expect(await tts('🐻 Бурого мишку')).toMatch(/Бурый мишка за курочку/i);
    expect(await tts('🦊 Лисичку')).toMatch(/Лисичка за бурого мишку/i);
    expect(await tts('🐠 Золотую рыбку')).toMatch(/Золотая рыбка за лисичку/i);
    expect(await tts('👧 Внучку')).toMatch(/Внучка за золотую рыбку/i);
    expect(await tts('👧 Внучка')).toMatch(/Внучка за внучку/i);
    expect(await tts('🧟‍ Зомби')).toMatch(/Зомби за внучку/i);
    expect(await tts('👴 Дедушку')).toMatch(/Дедушка за зомби/i);
    expect(await tts('📱 Алису')).toMatch(/Алиса за дедушку/i);
    expect(await tts('🧙‍♂️ Гарри Поттер')).toMatch(/Гарри поттер за алису/i);
    expect(await tts('🐭 Мышку')).toMatch(/Мышка за гарри поттера/i);
});

test('Персонажи с озвучкой 1', async () => {
    await text('');

    // prettier-ignore
    for (const char of [
        'внучка','слон', 'собака', 'ворона', 'сова', 'курочка', 'лисичка', 'волк', 'петушок',
        'котик', 'мишка', 'кошка', 'жучка', 'кот', 'дед',  'медведь', 'собачка', 'петух',
        'лев', 'котенок', 'дочка', 'курица', 'рыбка', 'крыса', 'корова', 'крокодил', 'тигр',
    ]) {
        expect(await tts(char)).toMatch(/<speaker audio/i);
    }
});

test('Персонажи с озвучкой 2', async () => {
    await text('');

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
        expect(await tts(char)).toMatch(/<speaker audio/i);
    }
});

test('Кнопки с уже выбранными персонажами не должны приходить повторно', async () => {
    const shownButtons: { [button: string]: string } = {};

    // Первый вызов кнопки не приходят
    expect((await closure.handleCommand('')).buttons).toEqual([]);

    await text('Сашку');
    let btns = (await closure.handleCommand('Пашку')).buttons || [];
    expect(btns).toHaveLength(2);

    while (true) {
        const [first, second] = btns;

        expect(shownButtons).not.toHaveProperty(first.title);
        second && expect(shownButtons).not.toHaveProperty(second.title);

        shownButtons[first.title] = first.title;
        btns = (await closure.handleCommand(first.title)).buttons || [];

        if (first.title.match(/мышку/i)) {
            break;
        }
    }
});

test('Вместе с неодушевленным персонажем выводим только две кнопки', async () => {
    await text('');
    await text('котик');

    const { buttons } = await closure.handleCommand('стул');

    expect(buttons).toHaveLength(2);
});

/**
 * Часто в самом начале игры люди вместо того, чтобы назвать персонажа,
 * отвечают на вопрос "Хотите поиграть…" и говорят "Да"
 */
test('При фразе «Да» повторяет призыв персонажа', async () => {
    await text('');
    const answer = await text('', 'YANDEX.CONFIRM');

    expect(answer).not.toMatch(/не похоже/i);
    expect(answer).toMatch(/кого позвал дедка/i);
});

test('Выводит помощь на фразы «никого», «не знаю»', async () => {
    await text('');

    expect(await text('никого')).not.toMatch(/не похоже/i);
    expect(await text('не знаю')).not.toMatch(/не похоже/i);

    expect(await text('никого')).toMatch(/можете позвать любого персонажа/i);
    expect(await text('не знаю')).toMatch(/можете позвать любого персонажа/i);
});
