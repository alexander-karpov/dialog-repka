/**
 * Помогает сохранить правильные названия свойств в тексте
 *
 * interface Person {
 *    firstName: string;
 *    lastName: string;
 * }
 *
 * nameof<Person>("firstName"); // => "firstName"
 * nameof<Person>("noName");    // => compile time error
 */
export const nameof = <T>(name: keyof T) => name;
