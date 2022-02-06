export function upperFirst(str: string): string {
    if (!str[0]) {
        return str;
    }

    return `${str[0].toUpperCase()}${str.substring(1)}`;
}
