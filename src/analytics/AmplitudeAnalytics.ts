import axios from 'axios';
import { AnalyticsEvent } from './AnalyticsEvent';
import { Analytics } from './Analytics';

/**
 * Клиент логирования событий в https://amplitude.com
 */
export class AmplitudeAnalytics implements Analytics {
    constructor(private readonly apiKey: string) {}

    sendEvent(event: AnalyticsEvent): void {
        axios
            .post('https://api.amplitude.com/2/httpapi', {
                api_key: this.apiKey,
                events: [event],
            })
            .catch(function(error) {
                console.error(error);
            });
    }
}
