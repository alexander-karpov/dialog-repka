import assert from 'assert';
import { Action } from '../../Action';
import { ReplyBuilder } from '../../DialogBuilder2';
import { Input } from '../../DialogBuilder2/Input';
import { nameof } from '../../nameof';

export abstract class Feature<TInput extends Input = Input> {
    static readonly id: `${string}Feature` = 'Feature';

    private _triggeredTimes = 0;
    private _lastTriggeredOnMessage = 0;
    private _varIndexes?: number[];
    private _pinnedVariant?: number;
    private _seqIndex: number = 0;

    private _input!: TInput;
    private _isVariantsCalled?: boolean;
    private _isSequenceCalled?: boolean;

    async handle(input: TInput, reply: ReplyBuilder): Promise<boolean> {
        try {
            this._input = input;
            this._isVariantsCalled = false;
            this._isSequenceCalled = false;

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
            // @ts-expect-error
            this._input = undefined;
            this._isVariantsCalled = undefined;
            this._isSequenceCalled = undefined;
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

    protected variants(...actions: Action[]): boolean {
        assert(!this._isVariantsCalled, `Функция не вызывается дважды`);
        this._isVariantsCalled = true;

        if (this._varIndexes == undefined) {
            this._varIndexes = Array.from(actions, (_, i) => i);
        }

        if (this._varIndexes.length === 0) {
            return false;
        }

        const index =
            this._pinnedVariant ??
            this._varIndexes[Math.floor(this._input.random * this._varIndexes.length)];

        assert(index != undefined);

        const action = actions[index % actions.length];
        assert(action);

        action();

        /**
         * Если начата последовательность, нужно
         * вызывать один и тот же вариант пока она
         * не завершится
         */
        if (this._seqIndex > 0) {
            this._pinnedVariant = index;
        } else {
            this._pinnedVariant = undefined;
            this._varIndexes.splice(this._varIndexes.indexOf(index), 1);
        }

        return true;
    }

    protected sequence(...actions: Action[]): void {
        assert(!this._isSequenceCalled, `Функция не вызывается дважды`);
        this._isSequenceCalled = true;

        const action = actions[this._seqIndex];

        action?.();
        this._seqIndex += 1;

        if (this._seqIndex === actions.length) {
            this._seqIndex = 0;
        }
    }

    protected abstract implementation(
        input: Input,
        reply: ReplyBuilder
    ): Promise<boolean> | boolean;
}
