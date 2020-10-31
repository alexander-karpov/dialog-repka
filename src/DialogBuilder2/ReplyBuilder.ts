import { Predicate } from '../repka/Predicate';
import { DialogsResponse } from './DialogsResponse';
import { RandomProvider } from './RandomProvider';
import { ReplyText } from './ReplyText';

export class ReplyBuilder {
    private text = '';
    private tts = '';
    private imageId?: string;
    private readonly buttons: { title: string; url?: string }[] = [];

    constructor(private readonly random: RandomProvider) {}

    get buttonsCount(): number {
        return this.buttons.length;
    }

    withText(...speechParts: ReplyText[]): void {
        for (const part of speechParts) {
            this.addSpace(part);

            if (Array.isArray(part)) {
                this.text += part[0];
                this.tts += part[1];
            } else {
                this.text += part;
                this.tts += part;
            }
        }
    }

    withTts(...ttsParts: (string | number)[]): void {
        for (const part of ttsParts) {
            this.addSpaceToTts();
            this.tts += part;
        }
    }

    withTextPluralized(count: number, one: ReplyText, some: ReplyText, many: ReplyText): void {
        const caseIndex =
            count % 10 == 1 && count % 100 != 11
                ? 0
                : count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 >= 20)
                ? 1
                : 2;

        this.withText([one, some, many][caseIndex]);
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

        this.imageId = imageId;
    }

    selectRandom<TItem>(
        fn: (item: TItem) => void,
        items: TItem[],
        number = 1,
        filter: Predicate<TItem> = () => true
    ): void {
        if (number === 0 || items.length === 0) {
            return;
        }

        const randomItem = items[Math.floor(this.random.getRandom() * items.length)];

        if (filter(randomItem)) {
            fn(randomItem);
            number--;
        }

        this.selectRandom(
            fn,
            items.filter((item) => item !== randomItem),
            number,
            filter
        );
    }

    build(sceneName: string, model: unknown, endSession: boolean): DialogsResponse {
        const card = this.imageId
            ? {
                  type: 'BigImage',
                  image_id: this.imageId,
                  description: this.text.substr(0, 255),
              }
            : undefined;

        return {
            response: {
                text: this.text,
                tts: this.tts,
                card,
                end_session: endSession,
                buttons: this.buttons.map((item) => {
                    return {
                        title: item.title,
                        url: item.url,
                        hide: true,
                    };
                }),
            },
            session_state: {
                sceneName: sceneName,
                data: model,
            },
            version: '1.0',
        };
    }

    /**
     * Добавляет пробелы в конце text и tts
     * (нужно перед добавлением новой части)
     */
    private addSpace(part: ReplyText) {
        const textPart = Array.isArray(part) ? part[0] : part;
        const textPartString = textPart.toString();

        if (
            this.text &&
            !this.text.endsWith(' ') &&
            !textPartString.startsWith(',') &&
            !textPartString.startsWith('.')
        ) {
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
