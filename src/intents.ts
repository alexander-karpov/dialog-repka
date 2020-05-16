import { Token, isTokenIncludesLex } from './/stemmer/tokens';
import { Character } from './Character';

export function granny(char: Character) {
    return Character.equals(['бабка', 'бабушка', 'баба'], char);
}

export function grandfather(char: Character) {
    return Character.startsWith('дед', char);
}

export function alice(char: Character) {
    return Character.equals('алиса', char);
}

export function harryPotter(char: Character) {
    return Character.nominative(char).toLocaleLowerCase() === 'гарри поттер';
}

export function rat(char: Character) {
    return Character.startsWith('крыс', char);
}

export function cat(char: Character) {
    return Character.startsWith(['кош', 'кот', 'киск', 'мурк'], char);
}

export function elephant(char: Character) {
    return Character.startsWith('слон', char);
}

export function fish(char: Character) {
    return Character.equals(['рыба', 'рыбка'], char);
}

export function wolf(char: Character) {
    return Character.startsWith(['волк', 'волч'], char);
}

export function crow(char: Character) {
    return Character.startsWith('ворон', char);
}

export function cow(char: Character) {
    return Character.startsWith('коров', char);
}

export function crocodile(char: Character) {
    return Character.startsWith('крокодил', char);
}

export function tiger(char: Character) {
    return Character.startsWith('тигр', char);
}

export function dino(char: Character) {
    return Character.startsWith('динозавр', char);
}

export function chicken(char: Character) {
    return Character.startsWith(['куриц', 'курочк'], char);
}

export function lion(char: Character) {
    return Character.startsWith('льв', char) || Character.equals('лев', char);
}

export function rooster(char: Character) {
    return Character.startsWith(['петух', 'петуш'], char);
}

export function dog(char: Character) {
    return (
        Character.equals('пес', char) ||
        Character.equals('песик', char) ||
        Character.equals('жучка', char) ||
        Character.startsWith(['собак', 'собач', 'щено'], char)
    );
}

export function owl(char: Character) {
    return Character.startsWith(['сова', 'совен', 'филин', 'совуш', 'совун'], char);
}

export function mouse(char: Character) {
    return Character.startsWith('мыш', char);
}

export function bear(char: Character) {
    return (
        Character.equals(['мишка', 'мишутка'], char) ||
        Character.startsWith(['медвед', 'медвеж'], char)
    );
}

export function fox(char: Character) {
    return Character.startsWith('лис', char);
}

export function girl(char: Character) {
    return Character.equals(['внучка', 'девочка', 'дочка', 'маша'], char);
}

export function zombie(char: Character) {
    return Character.equals('зомби', char);
}

export function help(tokens: Token[]) {
    const text = tokens.map((t) => t.text).join(' ');
    return text === 'что ты умеешь' || text === 'помощь';
}

export function wantsRepeat(tokens: Token[]) {
    return isIncludeAnyLex(tokens, [
        'да',
        'давать',
        'продолжать',
        'ладно',
        'хотеть',
        'заново',
        'снова',
        'сначала',
    ]);
}

export function notWantRepeat(tokens: Token[]) {
    const text = tokens.map((t) => t.text);

    return Boolean(
        text.includes('достаточно') ||
            text.includes('хватит') ||
            text.includes('нет') ||
            text.includes('конец') ||
            text.includes('пока') ||
            text.join(' ').includes('не надо')
    );
}

function isIncludeAnyLex(ts: Token[], cases: string[]) {
    return ts.some((t) => cases.some((c) => isTokenIncludesLex(t, c)));
}
