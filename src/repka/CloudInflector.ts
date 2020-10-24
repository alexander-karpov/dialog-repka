import axios from 'axios';
import { Grammama } from './Grammama';
import { Inflector } from './Inflector';

/**
 * Склоняет слова обращаясь к облачной функции.
 */
export class CloudInflector implements Inflector {
    async inflect(normalForm: string, grs: Grammama[]): Promise<string> {
        const normalFormEncoded = encodeURIComponent(normalForm);
        const grsEncoded = encodeURIComponent(grs.join());
        const callUrl = `https://functions.yandexcloud.net/d4e445nfmaevi790gq2c?inflect=${normalFormEncoded}&grs=${grsEncoded}`;

        const response = await axios.get<string>(callUrl);

        if (response.status !== 200 || typeof response.data !== 'string') {
            throw new Error(
                `Что-то пошло не так со склонением слова ${normalForm} в форму ${grs.join(',')}`
            );
        }

        return response.data;
    }
}
