import { ReplyBuilder } from '../src/DialogBuilder2';
import { DialogsRequest } from '../src/DialogBuilder2/DialogsRequest';
import { Input } from '../src/DialogBuilder2/Input';
import { RandomProvider } from '../src/DialogBuilder2/RandomProvider';
import { Feature } from '../src/hagi/features/Feature';
import { SplitByOrFeature } from '../src/hagi/features/SplitByOrFeature';
import { VerbTailFeature } from '../src/hagi/features/VerbTailFeature';

async function handle<T extends Input>(
    feature: Feature<T>,
    props: Partial<T> = {}
): Promise<string> {
    const reply = new ReplyBuilder(new RandomProvider());
    const command = props.command ?? 'привет друг';

    // @ts-expect-error Да, но что теперь
    const defaultInput: T = {
        command: command,
        tokens: command.split(' '),
        originalUtterance: command,
        messageIndex: 0,
        intents: {},
        random: 0,
        request: {} as DialogsRequest,
        isConfirm: false,
        isReject: false,
    };

    await feature.handle(Object.assign(defaultInput, props), reply);

    return reply.build('Start', {}, false).response.text;
}

describe('Variants', () => {
    test('Random choice', async () => {
        class VariantsFeature extends Feature {
            protected override implementation(
                _input: Input,
                reply: ReplyBuilder
            ): boolean | Promise<boolean> {
                return this.variants(
                    () => reply.withText('Я Саша Карпов'),
                    () => reply.withText('Я живу в России'),
                    () => reply.withText('А ты где живёшь?')
                );
            }
        }

        const feature = new VariantsFeature();

        expect(await handle(feature, { random: 2 / 3 })).toMatch('А ты где живёшь?');
        expect(await handle(feature, { random: 0 / 3 })).toMatch('Я Саша Карпов');
        expect(await handle(feature, { random: 1 / 3 })).toMatch('Я живу в России');
    });

    test('Sequence', async () => {
        class VariantsAndSequenceFeature extends Feature {
            protected override implementation(
                _input: Input,
                reply: ReplyBuilder
            ): boolean | Promise<boolean> {
                return this.variants(
                    () => reply.withText('Я Саша Карпов'),
                    () =>
                        this.sequence(
                            () => reply.withText('Я живу в России'),
                            () => reply.withText('А ты где живёшь?')
                        ),
                    () => reply.withText('Ну и отлично')
                );
            }
        }

        const feature = new VariantsAndSequenceFeature();

        expect(await handle(feature)).toMatch('Я Саша Карпов');
        expect(await handle(feature)).toMatch('Я живу в России');
        expect(await handle(feature)).toMatch('А ты где живёшь?');
        expect(await handle(feature)).toMatch('Ну и отлично');
    });
});

describe('SplitByOrFeature', () => {
    test('Разделяет текст', async () => {
        const feature = new SplitByOrFeature();

        const reversedTokens: [string, string, string][] = [
            ['ты', 'я', ''],
            ['хороший', 'хороший', ''],
            ['или', 'или', ''],
            ['плохой', 'плохой', ''],
        ];

        expect(await handle(feature, { random: 0, reversedTokens })).toMatch('я хороший');
        expect(await handle(feature, { random: 0.9, reversedTokens })).toMatch('плохой');
    });
});

describe('VerbTailFeature', () => {
    test('Добавляет глагол в конец текста', async () => {
        const feature = new VerbTailFeature();

        const reversedTokens: [string, string, string][] = [
            ['давай', 'давай', ''],
            ['играть', 'играть', 'VERB'],
        ];

        expect(await handle(feature, { messageIndex: 100, reversedTokens })).toMatch(
            'давай играть. играть!'
        );
    });
});
