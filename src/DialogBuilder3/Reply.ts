import { ReplyTextPart, ResponseBuilder } from './ResponseBuilder';

export class Reply {
    text: string[] = [];
    tts: string[] = [];

    constructor(...text: (ReplyTextPart | string)[]) {
        for (const t of text) {
            if (Array.isArray(t)) {
                this.text.push(t[0]);
                this.tts.push(t[1]);
            } else {
                this.text.push(t);
                this.tts.push(t);
            }
        }
    }

    addTo(response: ResponseBuilder): void {
        response.text(this.text);
    }
}
