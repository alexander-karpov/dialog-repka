import { Input } from './Input';
import { TopicProposal } from './TopicProposal';

export interface Topic {
    update(input: Input): TopicProposal | undefined;
}
