import { Reply } from './ResponseBuilder';

export interface TopicProposal {
    replies: Reply[];
    continuation?: Function | false;
}
