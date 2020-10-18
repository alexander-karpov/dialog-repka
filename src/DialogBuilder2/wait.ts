import { CancellationToken } from './CancellationToken';

export function wait(delay: number, token?: CancellationToken): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(() => {
            if (token?.isCancellationRequested) {
                return;
            }

            resolve();
        }, delay);
    });
}
