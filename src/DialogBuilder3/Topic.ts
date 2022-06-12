import { Input } from './Input';
import { TopicProposal } from './TopicProposal';

export abstract class Topic {
    $$type: string;
    $$continuation?: string;

    constructor() {
        this.$$type = this.constructor.name;
    }

    abstract update(input: Input): TopicProposal | undefined;
}
