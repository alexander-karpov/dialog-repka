import { Action } from '../Action';

export function wait(delay: number): [Promise<unknown>, Action] {
    let timeoutId: NodeJS.Timeout;

    const timeoutPromise = new Promise((resolve) => {
        timeoutId = setTimeout(resolve, delay);
    });

    return [timeoutPromise, () => clearTimeout(timeoutId)];
}
