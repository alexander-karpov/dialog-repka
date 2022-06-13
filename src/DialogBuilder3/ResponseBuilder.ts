import { DialogsResponse } from './DialogsResponse';
import { Input, Topic } from '.';
import { last } from '../repka/last';

export type ReplyTextPart = [string, string];

export class ResponseBuilder {
    protected textParts: string[] = [];
    protected ttsParts: string[] = [];
    protected imageId?: string;
    protected galleryImageIds: string[] = [];
    protected readonly buttons: { title: string; url?: string }[] = [];
    protected endSession: boolean = false;
    protected topicsState: Topic[] = [];

    get buttonsCount(): number {
        return this.buttons.length;
    }

    text(text: string[]): void {
        for (const part of text) {
            const prev = last(this.textParts);

            if (prev && !prev.endsWith(' ') && !part.startsWith(',') && !part.startsWith('.')) {
                this.textParts.push(' ');
            }

            this.textParts.push(part);
        }
    }

    withTts(...tts: string[]): void {
        for (const part of tts) {
            const prev = last(this.ttsParts);

            if (prev && !prev.endsWith(' ') && !part.startsWith(',') && !part.startsWith('.')) {
                this.ttsParts.push(' ');
            }

            this.ttsParts.push(part);
        }
    }

    topics(state: Topic[]) {
        this.topicsState = state;
    }

    /**
     * Выводит тишину заданной длительности
     * @param milliseconds Миллисекунды
     */
    silence(milliseconds: number): void {
        this.ttsParts.push(`sil <[${milliseconds}]>`);
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

    build(): DialogsResponse {
        const text = this.textParts.join('').substring(0, 1024);
        const tts = this.ttsParts.join('').substring(0, 1024);

        const card = this.imageId
            ? {
                  type: 'BigImage',
                  image_id: this.imageId,
                  description: text.substring(0, 256),
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
                text,
                tts,
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
            session_state: { [Input.TopicsStateProp]: this.topicsState },
            version: '1.0',
        };
    }
}
