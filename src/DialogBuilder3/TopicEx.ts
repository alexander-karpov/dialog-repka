import { nameof } from '../nameof';
import { Topic } from './Topic';

export interface TopicEx extends Topic {
    $id: string;
    $isDisposable?: boolean;
}

export function isTopicEx(topic: Topic): topic is TopicEx {
    return nameof<TopicEx>('$id') in topic;
}
