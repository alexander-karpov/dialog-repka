import { Reply } from './Reply';

export interface TopicProposal {
    body?: Reply;
    continuation?: Function | false;
}
