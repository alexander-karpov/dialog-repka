import { DialogsRequest } from '../DialogBuilder2/DialogsRequest';
import { AnalyticsEventProps } from './AnalyticsEventProps';

/**
 * Событие аналитики, счетчик
 * @see https://developers.amplitude.com/#http-api-v2-request-format
 */
export class AnalyticsEvent {
    private readonly event_type: string;
    private readonly user_id: string;
    private readonly time: number;
    private readonly region: string;
    private readonly insert_id: string;
    private readonly event_properties: AnalyticsEventProps;
    private readonly user_properties: AnalyticsEventProps;

    constructor(
        eventType: string,
        time: number,
        request: DialogsRequest,
        eventProps: AnalyticsEventProps,
        userProps: AnalyticsEventProps
    ) {
        this.event_type = eventType;
        this.time = time;
        this.user_id = request.session.application.application_id;
        this.region = request.meta.timezone;
        this.insert_id = `${eventType}${request.session.session_id}${request.session.message_id}`;
        this.event_properties = eventProps;
        this.user_properties = userProps;
    }

    toString(): string {
        return `Event { ${this.event_type} }`;
    }
}
