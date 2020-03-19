/**
 * Синхронизирует содержимое папки tunes
 * с хранилищем мелодий в навыке.
 * Обновляет файл tunes/tunes.json
 */

const axios = require('axios').default;
const fs = require('fs');
const FormData = require('form-data');

const skillId = process.argv[2];
const oauthToken = process.argv[3];

if (!skillId) {
    console.error(
        '\x1b[31mПервым параметром нужно передать идентификатор навыка.',
        'Идентификатор навыка можно посмотреть в консоли разработчика (https://dialogs.yandex.ru/developer/).',
        'Зайдите на страницу навыка, откройте вкладку «Общие сведения» и пролистайте вниз.',
        '\x1b[0m'
    );

    return 1;
}

if (!oauthToken) {
    console.error(
        '\x1b[31mВторым параметром нужно передать OAuth-токен для Диалогов.',
        'Можно получить на этой странице https://oauth.yandex.ru/authorize?response_type=token&client_id=c473ca268cd749d3a8371351a8f2bcbd',
        '\x1b[0m'
    );

    return 1;
}

const dialogsApi = axios.create({
    baseURL: `https://dialogs.yandex.net/api/v1/skills/${skillId}`,
    headers: {
        Authorization: `OAuth ${oauthToken}`,
    },
});

(async function () {
    /**
     * Список треков в хранилище диалога
     */
    const remoteTunes = (await dialogsApi.get('sounds')).data.sounds;
    const remoteTuneNames = remoteTunes.map((s) => s.originalName);

    /**
     * Список треков в папке tunes
     */
    const localTuneNames = fs
        .readdirSync('./tunes', { withFileTypes: true })
        .filter((f) => f.isFile() && f.name.endsWith('.mp3'))
        .map((f) => f.name);

    /**
     * Загружаем треки, которые есть локально,
     * но не загружены в хранилище диалога
     */
    for (const localTuneName of localTuneNames.filter((t) => !remoteTuneNames.includes(t))) {
        console.log(`\x1b[32m+ ${localTuneName}\x1b[0m`);

        const formData = new FormData();
        formData.append('file', fs.readFileSync(`./tunes/${localTuneName}`), localTuneName);

        await dialogsApi.post('sounds', formData, {
            headers: formData.getHeaders(),
        });
    }

    /**
     * Удаляет из хранилища треки, которых нет локально
     */
    for (const remoteTune of remoteTunes.filter(t => !localTuneNames.includes(t.originalName))) {
        console.log(`\x1b[31m- ${remoteTune.originalName}\x1b[0m`);

        await dialogsApi.delete(`sounds/${remoteTune.id}`);
    }

    /**
     * Сохраняем итоговый список треков с их id
     */
    const finalUploadTunes = {};

    (await dialogsApi.get('sounds')).data.sounds.forEach((s) => {
        finalUploadTunes[s.originalName] = s.id;
    });

    fs.writeFileSync('./tunes/tunes.json', JSON.stringify(finalUploadTunes, null, 4));
})();
