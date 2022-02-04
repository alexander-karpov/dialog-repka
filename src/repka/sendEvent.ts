/**
 * Временное решение для отправки счётчиков
 * пока не придумал хорошее решение
 * с инверсией зависимостей
 */
import { Analytics } from '../analytics/Analytics';
import { AmplitudeAnalytics } from '../analytics/AmplitudeAnalytics';
import { ConsoleAnalytics } from '../analytics/ConsoleAnalytics';
import { AnalyticsEvent } from '../analytics/AnalyticsEvent';
import { DialogsRequest } from '../DialogBuilder2/DialogsRequest';
import { AnalyticsEventProps } from '../analytics/AnalyticsEventProps';

const AMPLITUDE_REPKA_API_KEY = process.env['AMPLITUDE_REPKA_API_KEY'];

const analytics: Analytics = AMPLITUDE_REPKA_API_KEY
    ? new AmplitudeAnalytics(AMPLITUDE_REPKA_API_KEY)
    : new ConsoleAnalytics();

let currentRequest: DialogsRequest;

export function setEventRequest(request: DialogsRequest): void {
    currentRequest = request;
}

export function sendEvent(eventType: string, eventProps: AnalyticsEventProps = {}): void {
    if (!currentRequest) {
        return;
    }

    analytics.sendEvent(
        new AnalyticsEvent(
            eventType,
            new Date().getTime(),
            currentRequest,
            Object.assign(eventProps, {
                command: currentRequest.request.command,
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                sceneName: currentRequest.state.session.sceneName,
            }),
            {}
        )
    );
}
