import { Character } from './Character';

export function granny(char: Character): boolean {
    return Character.equals(['бабка', 'бабушка', 'баба'], char);
}

export function grandfather(char: Character): boolean {
    return Character.startsWith('дед', char);
}

export function alice(char: Character): boolean {
    return Character.equals('алиса', char);
}

export function harryPotter(char: Character): boolean {
    return Character.nominative(char).toLocaleLowerCase() === 'гарри поттер';
}

export function rat(char: Character): boolean {
    return Character.startsWith('крыс', char);
}

export function cat(char: Character): boolean {
    return Character.startsWith(['кош', 'кот', 'киск', 'мурк'], char);
}

export function elephant(char: Character): boolean {
    return Character.startsWith('слон', char);
}

export function fish(char: Character): boolean {
    return Character.equals(['рыба', 'рыбка'], char);
}

export function wolf(char: Character): boolean {
    return Character.startsWith(['волк', 'волч'], char);
}

export function crow(char: Character): boolean {
    return Character.startsWith('ворон', char);
}

export function cow(char: Character): boolean {
    return Character.startsWith('коров', char);
}

export function crocodile(char: Character): boolean {
    return Character.startsWith('крокодил', char);
}

export function tiger(char: Character): boolean {
    return Character.startsWith('тигр', char);
}

export function dino(char: Character): boolean {
    return Character.startsWith('динозавр', char);
}

export function chicken(char: Character): boolean {
    return Character.startsWith(['куриц', 'курочк'], char);
}

export function lion(char: Character): boolean {
    return Character.startsWith('льв', char) || Character.equals('лев', char);
}

export function rooster(char: Character): boolean {
    return Character.startsWith(['петух', 'петуш'], char);
}

export function dog(char: Character): boolean {
    return (
        Character.equals('пес', char) ||
        Character.equals('песик', char) ||
        Character.equals('жучка', char) ||
        Character.startsWith(['собак', 'собач', 'щено'], char)
    );
}

export function owl(char: Character): boolean {
    return Character.startsWith(['сова', 'совен', 'филин', 'совуш', 'совун'], char);
}

export function mouse(char: Character): boolean {
    return Character.startsWith('мыш', char);
}

export function bear(char: Character): boolean {
    return (
        Character.equals(['мишка', 'мишутка'], char) ||
        Character.startsWith(['медвед', 'медвеж'], char)
    );
}

export function fox(char: Character): boolean {
    return Character.startsWith('лис', char);
}

export function girl(char: Character): boolean {
    return Character.equals(['внучка', 'девочка', 'дочка', 'маша'], char);
}

export function zombie(char: Character): boolean {
    return Character.equals('зомби', char);
}

export function horse(char: Character): boolean {
    return Character.equals(['лошадь', 'лошадка', 'конь', 'кобыла', 'кобылка'], char);
}

export function frog(char: Character): boolean {
    return Character.startsWith(['лягуш', 'жаб'], char);
}
