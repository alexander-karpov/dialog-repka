import { CancellationToken } from './CancellationToken';

export class CancellationTokenSource {
    private readonly tokenInternal = {
        isCancellationRequested: false,
    };

    get token(): CancellationToken {
        return this.tokenInternal;
    }

    cancel(): void {
        this.tokenInternal.isCancellationRequested = true;
    }
}
