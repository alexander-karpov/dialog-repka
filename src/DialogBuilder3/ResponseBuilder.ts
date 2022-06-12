import { Predicate } from '../Predicate';
import { DialogsResponse } from './DialogsResponse';
import { RandomProvider } from './RandomProvider';
import { VoiceEffect } from './VoiceEffect';
import { Input, Topic } from '.';

type ReplyTextPart = string | [string, string];

export class ResponseBuilder {
    private textParts = '';
    private ttsParts = '';
    private imageId?: string;
    private galleryImageIds: string[] = [];
    private readonly buttons: { title: string; url?: string }[] = [];
    private endSession: boolean = false;

    get buttonsCount(): number {
        return this.buttons.length;
    }

    text(...speechParts: ReplyTextPart[]): void {
        for (const part of speechParts) {
            this.addSpace(part);

            if (Array.isArray(part)) {
                this.textParts += part[0];
                this.ttsParts += part[1];
            } else {
                this.textParts += part;
                this.ttsParts += part;
            }
        }
    }

    /**
     * Выводит текст басом
     * @param text Текст
     */
    pitchDownVoice(...text: ReplyTextPart[]): void {
        this.voice(VoiceEffect.PitchDown, text);
    }

    /**
     * Выводит текст голосом хомяка
     * @param text Текст
     */
    hamsterVoice(...text: ReplyTextPart[]): void {
        this.voice(VoiceEffect.Hamster, text);
    }

    /**
     * Выводит тишину заданной длительности
     * @param milliseconds Миллисекунды
     */
    silence(milliseconds: number): void {
        this.ttsParts += `sil <[${milliseconds}]>`;
    }

    withTts(...ttsParts: (string | number)[]): void {
        for (const part of ttsParts) {
            this.addSpaceToTts();
            this.ttsParts += part;
        }
    }

    withButton(params: string | { title: string; url: string }): void {
        if (typeof params === 'string') {
            this.buttons.push({ title: params });
        } else {
            this.buttons.push(params);
        }
    }

    withImage(imageId: string): void {
        if (this.imageId) {
            throw new Error('Изображение уже задано.');
        }

        if (this.galleryImageIds.length) {
            throw new Error('Изображение галереи уже задано.');
        }

        this.imageId = imageId;
    }

    withGalleryImage(imageId: string): void {
        if (this.imageId) {
            throw new Error('Изображение уже задано.');
        }

        this.galleryImageIds.push(imageId);
    }

    length(): number {
        return Math.max(this.textParts.length, this.ttsParts.length);
    }

    build(topics: Topic[]): DialogsResponse {
        const card = this.imageId
            ? {
                  type: 'BigImage',
                  image_id: this.imageId,
                  description: this.textParts.substr(0, 255),
              }
            : undefined;

        const gallery = this.galleryImageIds.length
            ? {
                  type: 'ImageGallery',
                  items: this.galleryImageIds.map((id) => ({ image_id: id })),
              }
            : undefined;

        return {
            response: {
                text: this.textParts,
                tts: this.ttsParts,
                card: gallery ?? card,
                end_session: this.endSession,
                buttons: this.buttons.map((item) => {
                    return {
                        title: item.title,
                        url: item.url,
                        hide: true,
                    };
                }),
            },
            session_state: { [Input.TopicsStateProp]: topics },
            version: '1.0',
        };
    }

    /**
     * Выводит текст с заданным эффектом голоса
     * @param effect Эффект голоса
     * @param text Текст
     */
    private voice(effect: VoiceEffect, text: ReplyTextPart[]): void {
        this.ttsParts += `<speaker effect="${effect}">`;
        this.text(...text);
        this.ttsParts += `<speaker effect="-">`;
    }

    /**
     * Добавляет пробелы в конце text и tts
     * (нужно перед добавлением новой части)
     */
    private addSpace(part: ReplyTextPart) {
        const textPart = Array.isArray(part) ? part[0] : part;
        const textPartString = textPart.toString();

        if (
            this.textParts &&
            !this.textParts.endsWith(' ') &&
            !textPartString.startsWith(',') &&
            !textPartString.startsWith('.')
        ) {
            this.textParts += ' ';
        }

        this.addSpaceToTts();
    }

    private addSpaceToTts() {
        if (this.ttsParts && !this.ttsParts.endsWith(' ')) {
            this.ttsParts += ' ';
        }
    }
}

// export class СhatterReply extends Reply {
//     constructor(...text: ReplyTextPart[]) {
//         super();

//         this.text(...text);
//     }
// }

export interface Reply {
    addTo(reply: ResponseBuilder): void;
}

export class BodyReply implements Reply {
    text: ReplyTextPart[];

    constructor(...text: ReplyTextPart[]) {
        this.text = text;
    }

    addTo(reply: ResponseBuilder): void {
        reply.text(...this.text);
    }
}
