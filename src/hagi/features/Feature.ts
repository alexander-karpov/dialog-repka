import { ReplyBuilder } from '../../DialogBuilder2';
import { Input } from '../../DialogBuilder2/Input';

export abstract class Feature {
    static id = 'Feature';

    // Сколько раз фича уже сработала
    private _triggeredTimes = 0;
    private _lastTriggeredOnMessage = 0;
    private _messageIndex? = 0;

    async handle(input: Input, reply: ReplyBuilder): Promise<boolean> {
        this._messageIndex = input.messageIndex;

        const handled = await this.implementation(input, reply);

        if (handled) {
            this._triggeredTimes += 1;
            this._lastTriggeredOnMessage = input.messageIndex;
        }

        // Не нужно сохранять между вызовами
        delete this._messageIndex;

        return handled;
    }

    protected isMessagesPassed(number: number): boolean {
        return (this._messageIndex ?? 0) - this._lastTriggeredOnMessage >= number;
    }

    protected get triggeredTimes(): number {
        return this._triggeredTimes;
    }

    protected abstract implementation(input: Input, reply: ReplyBuilder): Promise<boolean>;
}
