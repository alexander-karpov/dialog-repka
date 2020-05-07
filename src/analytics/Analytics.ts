import { AnalyticsEvent } from './AnalyticsEvent';

/**
 * Абстрактный отправлятор аналитики/счетчиков
 */
export interface Analytics {
    sendEvent(event: AnalyticsEvent): void;
}
