import { ReplyHandler } from './ReplyHandler';

export interface Ending<TModel> {
    reply: ReplyHandler<TModel>;
}
