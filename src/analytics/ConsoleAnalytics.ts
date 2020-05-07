import { AnalyticsEvent } from './AnalyticsEvent';
import { Analytics } from './Analytics';

/**
 * Клиент логирования событий в консоль
 */
export class ConsoleAnalytics implements Analytics {
    sendEvent(event: AnalyticsEvent): void {
        console.log(event.toString());
    }
}
