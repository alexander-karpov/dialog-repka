import { KnownChar } from './KnownChar';
import { KnownCharId } from './KnownCharId';
import * as intents from './intents';
import { Character } from '../repka/Character';
import { RepkaModel } from './RepkaModel';
import { ReplyBuilder } from '../DialogBuilder2';

export const knownChars: KnownChar[] = [
    {
        id: KnownCharId.Wolf,
        hint: '🐺 Серого волка',
        normal: 'волк',
        trigger: intents.wolf,
        image: '965417/9929614145838c2092ab',
        sounds: ['<speaker audio="alice-sounds-animals-wolf-1.opus">'],
    },
    {
        id: KnownCharId.Crow,
        hint: '🐦 Ворону',
        normal: 'ворона',
        trigger: intents.crow,
        image: '997614/61c6fab9d5da7f3a5eba',
        sounds: ['<speaker audio="alice-sounds-animals-crow-1.opus">'],
    },
    {
        id: KnownCharId.Cat,
        hint: '🐱 Маленького котёнка',
        normal: 'котёнк',
        trigger: intents.cat,
        image: '1540737/52f138d32164dcfb334b',
        sounds: [
            '<speaker audio="alice-sounds-animals-cat-1.opus">',
            '<speaker audio="alice-sounds-animals-cat-3.opus">',
            '<speaker audio="alice-sounds-animals-cat-4.opus">',
        ],
    },
    {
        id: KnownCharId.Mouse,
        hint: '🐭 Мышку',
        normal: 'мышка',
        trigger: intents.mouse,
        image: '1652229/dec46e3a051abd7eef90',
        sounds: ['<speaker audio="alice-music-violin-b-1.opus">'],
        isHidden: true,
    },
    {
        id: KnownCharId.Dog,
        hint: '🐶 Собаку',
        normal: 'собака',
        trigger: intents.dog,
        image: '1030494/fb311cc1fb2cb7fafa8a',
        sounds: [
            '<speaker audio="alice-sounds-animals-dog-3.opus">',
            '<speaker audio="alice-sounds-animals-dog-5.opus">',
        ],
    },
    {
        id: KnownCharId.Granny,
        hint: '👵 Бабушку',
        normal: 'бабушка',
        trigger: intents.granny,
        image: '965417/3f0555dd5901a0823e39',
        sounds: [],
    },
    {
        id: KnownCharId.Lion,
        hint: '🦁 Большого льва',
        normal: 'лев',
        trigger: intents.lion,
        image: '965417/e6c5fce891628ea6db10',
        sounds: ['<speaker audio="alice-sounds-animals-lion-1.opus">'],
    },
    {
        id: KnownCharId.Elephant,
        hint: '🐘 Слона',
        normal: 'слон',
        trigger: intents.elephant,
        image: '1540737/8d397cb056499591db59',
        sounds: [
            '<speaker audio="alice-sounds-animals-elephant-1.opus">',
            '<speaker audio="alice-sounds-animals-elephant-2.opus">',
        ],
    },
    {
        id: KnownCharId.Rooster,
        hint: '🐓 Петушка',
        normal: 'петушок',
        trigger: intents.rooster,
        image: '965417/d12602b30f51439b55b3',
        sounds: ['<speaker audio="alice-sounds-animals-rooster-1.opus">'],
    },
    {
        id: KnownCharId.Owl,
        hint: '🦉Сову',
        normal: 'сова',
        trigger: intents.owl,
        image: '1030494/246c82db66034ba90a3f',
        sounds: [
            '<speaker audio="alice-sounds-animals-owl-1.opus">',
            '<speaker audio="alice-sounds-animals-owl-2.opus">',
        ],
    },
    {
        id: KnownCharId.Chicken,
        hint: '🐔 Курочку',
        normal: 'курочка',
        trigger: intents.chicken,
        image: '213044/bb381ed46a4a6ed4cf2b',
        sounds: ['<speaker audio="alice-sounds-animals-chicken-1.opus">'],
    },
    {
        id: KnownCharId.Bear,
        hint: '🐻 Бурого мишку',
        normal: 'мишка',
        trigger: intents.bear,
        image: '1656841/1683fc7e7260af4218c4',
        sounds: [
            '<speaker audio="dialogs-upload/d72eedce-c6f5-412b-8ed7-93cdccd9b716/e29520bc-c2e2-40e5-9b7a-bc805fe89b1e.opus">',
            '<speaker audio="dialogs-upload/d72eedce-c6f5-412b-8ed7-93cdccd9b716/baef2695-35fd-471b-b40f-7c34f7eeec31.opus">',
        ],
    },
    {
        id: KnownCharId.Fox,
        hint: '🦊 Лисичку',
        normal: 'лисичка',
        trigger: intents.fox,
        image: '965417/a07c3f1a434e63760055',
        sounds: ['<speaker audio="alice-music-violin-c-1.opus">'],
    },
    {
        id: KnownCharId.Fish,
        hint: '🐠 Золотую рыбку',
        normal: 'рыбка',
        trigger: intents.fish,
        sounds: [],
    },
    {
        id: KnownCharId.Girl,
        hint: '👧 Внучку',
        normal: 'внучка',
        trigger: intents.girl,
        image: '965417/04042969d5ad6db34bc3',
        sounds: ['<speaker audio="alice-sounds-human-laugh-5.opus">'],
    },
    {
        id: KnownCharId.Zombie,
        hint: '🧟‍ Зомби',
        normal: 'зомби',
        trigger: intents.zombie,
        sounds: ['<speaker audio="alice-sounds-human-walking-dead-2.opus">'],
    },
    {
        id: KnownCharId.Grandfather,
        hint: '👴 Дедушку',
        normal: 'дедушка',
        trigger: intents.grandfather,
        sounds: [
            '<speaker audio="alice-sounds-human-sneeze-1.opus">',
            '<speaker audio="alice-sounds-human-sneeze-2.opus">',
        ],
    },
    {
        id: KnownCharId.Alice,
        hint: '📱 Алису',
        normal: 'алиса',
        trigger: intents.alice,
        image: '1030494/941a763ac0fcc18e2be8',
        sounds: ['Ваш голосовой помощник.'],
        isHidden: true,
    },
    {
        id: KnownCharId.HarryPotter,
        hint: '🧙‍♂️ Гарри Поттера',
        normal: 'гарри поттер',
        trigger: intents.harryPotter,
        sounds: [
            '<speaker audio="alice-sounds-game-powerup-1.opus">',
            '<speaker audio="alice-sounds-game-powerup-2.opus">',
        ],
    },
    {
        id: KnownCharId.Rat,
        hint: '🐁 Крысу',
        normal: 'крыса',
        trigger: intents.rat,
        sounds: [
            '<speaker audio="dialogs-upload/d72eedce-c6f5-412b-8ed7-93cdccd9b716/01ae230e-69f3-4f76-93e8-8da388f7cf65.opus">',
            '<speaker audio="dialogs-upload/d72eedce-c6f5-412b-8ed7-93cdccd9b716/7f7c2a7d-b8bc-4a13-ad74-c1d0bf5f5797.opus">',
        ],
    },
    {
        id: KnownCharId.Cow,
        hint: '🐮 Коровушку',
        normal: 'коровушка',
        trigger: intents.cow,
        sounds: ['<speaker audio="alice-sounds-animals-cow-2.opus">'],
    },
    {
        id: KnownCharId.Crocodile,
        hint: '🐊 Крокодила',
        normal: 'крокодил',
        trigger: intents.crocodile,
        sounds: [
            '<speaker audio="dialogs-upload/d72eedce-c6f5-412b-8ed7-93cdccd9b716/38d9977f-9dd8-421d-866c-14900749f7cd.opus">',
        ],
    },
    {
        id: KnownCharId.Tiger,
        hint: '🐯 Тигра',
        normal: 'тигр',
        trigger: intents.tiger,
        sounds: [
            '<speaker audio="dialogs-upload/d72eedce-c6f5-412b-8ed7-93cdccd9b716/29479c2a-e251-495a-a387-1473c5422aff.opus">',
        ],
    },
    {
        id: KnownCharId.Dino,
        hint: '🦖 Динозавра',
        normal: 'динозавр',
        trigger: intents.dino,
        sounds: [
            '<speaker audio="dialogs-upload/d72eedce-c6f5-412b-8ed7-93cdccd9b716/7f5e067f-f1c7-45c8-ac0e-136ed2946e48.opus">',
        ],
    },
    {
        id: KnownCharId.Horse,
        hint: '🐴 Лошадку',
        normal: 'лошадка',
        trigger: intents.horse,
        sounds: [
            '<speaker audio="alice-sounds-animals-horse-1.opus">',
            '<speaker audio="alice-sounds-animals-horse-2.opus">',
        ],
    },
    {
        id: KnownCharId.Frog,
        hint: '🐸 Лягушку',
        normal: 'лягушка',
        trigger: intents.frog,
        sounds: ['<speaker audio="alice-sounds-animals-frog-1.opus">'],
    },
    {
        id: KnownCharId.Poo,
        hint: '💩 Какашку',
        normal: 'какашка',
        trigger: intents.poo,
        sounds: ['<speaker audio="alice-sounds-things-toilet-1.opus"> - Фу-у! - -'],
        isHidden: true,
    },
    {
        id: KnownCharId.Putin,
        hint: '🤵 Путина',
        normal: 'путин',
        trigger: intents.putin,
        sounds: [],
        isHidden: true,
    },
    {
        id: KnownCharId.Yaga,
        hint: '🧙 Бабу Ягу',
        normal: 'баба яга',
        trigger: intents.yaga,
        sounds: ['<speaker audio="alice-sounds-human-laugh-4.opus">'],
    },
    {
        id: KnownCharId.Unicorn,
        hint: '🦄 Единорога',
        normal: 'единорог',
        trigger: intents.unicorn,
        sounds: [
            '<speaker audio="alice-sounds-animals-horse-1.opus"><speaker audio="alice-sounds-game-powerup-1.opus">',
        ],
    },
    {
        id: KnownCharId.HuggyWuggy,
        hint: '🫂 Хаги Ваги',
        normal: 'хаги ваги',
        trigger: (char: Character): boolean => char.normal === 'хаги ваги',
        isHidden: true,
        sounds: [],
        phrase: (reply: ReplyBuilder): void => {
            reply.pitchDownVoice('Я Хаги Ваги. Давай обнимемся.');
            reply.silence(300);
            reply.pitchDownVoice('Или я съем тебя!');
            reply.silence(300);
        },
    },
];
