import { nameof } from '../nameof';
import { Topic } from './Topic';

export interface TopicEx extends Topic {
    $$type: string;
    $$continuation?: string;
}

export function isTopicEx(topic: Topic): topic is TopicEx {
    return nameof<TopicEx>('$$type') in topic;
}
