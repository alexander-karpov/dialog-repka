import assert from 'assert';
import { Action } from '../../Action';
import { ReplyBuilder } from '../../DialogBuilder2';
import { Input } from '../../DialogBuilder2/Input';

export abstract class Feature<TInput extends Input> {
    static readonly id: `${string}Feature` = 'Feature';

    private _triggeredTimes = 0;
    private _lastTriggeredOnMessage = 0;
    private _variantsIndexes: Record<string, number[]> = {};

    private _input!: TInput;
    private _isVariantsCalled!: Set<string>;

    async handle(input: TInput, reply: ReplyBuilder): Promise<boolean> {
        try {
            this._input = input;
            this._isVariantsCalled = new Set();

            const handled = await this.implementation(input, reply);

            if (handled) {
                this._triggeredTimes += 1;
                this._lastTriggeredOnMessage = input.messageIndex;
            }

            return handled;
        } catch (error) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            console.error(`'Ошибка при выполнении ${this.constructor?.id}:'`, error);
            return false;
        } finally {
            // Не нужно сохранять между вызовами
            // @ts-expect-error
            delete this._input;
            // @ts-expect-error
            delete this._isVariantsCalled;
        }
    }

    protected isMessagesPassed(number: number): boolean {
        return (this._input.messageIndex ?? 0) - this._lastTriggeredOnMessage >= number;
    }

    protected wait(number: number): boolean {
        return !this.isMessagesPassed(number);
    }

    protected get triggeredTimes(): number {
        return this._triggeredTimes;
    }

    protected variants(actions: Action[], id: string = 'default'): boolean {
        assert(this._isVariantsCalled.has(id), `Функция variants не вызывается дважды c id ${id}`);
        this._isVariantsCalled.add(id);

        const restoredIndexes = this._variantsIndexes[id];
        const indexes = restoredIndexes ?? Array.from(actions, (_, i) => i);

        if (indexes.length === 0) {
            return false;
        }

        const index = indexes[Math.floor(this._input.random * indexes.length)];
        assert(index);

        const action = actions[index % actions.length];
        assert(action);

        action();

        indexes.splice(index, 1);
        this._variantsIndexes[id] = indexes;

        return true;
    }

    protected abstract implementation(
        input: Input,
        reply: ReplyBuilder
    ): Promise<boolean> | boolean;
}
