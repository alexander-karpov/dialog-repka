import { ReplyBuilder } from './ReplyBuilder';
import { DialogResponse } from './DialogResponse';
import { ReplyText } from './ReplyText';

export class JustReplyBuilder implements ReplyBuilder {
    private text: string = '';
    private tts: string = '';
    private endSession: boolean = false;
    private readonly buttons: { title: string; url?: string }[] = [];

    withText(...speechParts: ReplyText[]) {
        for (const part of speechParts) {
            this.addSpace();

            if (Array.isArray(part)) {
                this.text += part[0];
                this.tts += part[1];
            } else {
                this.text += part;
                this.tts += part;
            }
        }

        return this;
    }

    withTts(...ttsParts: (string | number)[]) {
        for (const part of ttsParts) {
            this.addSpaceToTts();
            this.tts += part;
        }

        return this;
    }

    withTextPluralized(count: number, one: ReplyText, some: ReplyText, many: ReplyText) {
        const caseIndex =
            count % 10 == 1 && count % 100 != 11
                ? 0
                : count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 >= 20)
                ? 1
                : 2;

        this.withText([one, some, many][caseIndex]);

        return this;
    }

    withEndSession() {
        this.endSession = true;

        return this;
    }

    withButton(params: string | { title: string; url: string }) {
        if (typeof params === 'string') {
            this.buttons.push({ title: params });
        } else {
            this.buttons.push(params);
        }

        return this;
    }

    build<TSessionState>(sessionState: TSessionState): DialogResponse {
        return {
            response: {
                text: this.text,
                tts: this.tts,
                end_session: this.endSession,
                buttons: this.buttons.map(item => {
                    return {
                        title: item.title,
                        url: item.url,
                        hide: true
                    }
                })
            },
            session_state: sessionState,
            version: '1.0',
        };
    }

    /**
     * Добавляет пробелы в конце text и tts
     * (нужно перед добавлением новой части)
     */
    private addSpace() {
        if (this.text && !this.text.endsWith(' ')) {
            this.text += ' ';
        }

        this.addSpaceToTts();
    }

    private addSpaceToTts() {
        if (this.tts && !this.tts.endsWith(' ')) {
            this.tts += ' ';
        }
    }
}
