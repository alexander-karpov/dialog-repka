import { ReplyBuilder } from '../src/DialogBuilder2';
import { DialogsIntents } from '../src/DialogBuilder2/DialogsIntents';
import { DialogsRequest } from '../src/DialogBuilder2/DialogsRequest';
import { Input } from '../src/DialogBuilder2/Input';
import { RandomProvider } from '../src/DialogBuilder2/RandomProvider';
import { Feature } from '../src/hagi/features/Feature';

async function handle(feature: Feature<Input>, props: Partial<Input> = {}): Promise<string> {
    const reply = new ReplyBuilder(new RandomProvider());
    const command = props.command ?? 'привет друг';

    const defaultInput: Input = {
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
