import { localFormat } from "../../resources/config/information.json";

export function numberFormat(number: number) : string {
    return number.toLocaleString(localFormat);
}

export function dateFormat(date: Date, separator = "-") : string {
    return date.toLocaleDateString(localFormat).replaceAll("/", separator);
}

export function getAge(birth: Date): number {
    const now = new Date();
    const months = now.getMonth() - birth.getMonth();
    let age = now.getFullYear() - birth.getFullYear();

    if (months < 0 || months === 0 && now.getDate() < birth.getDate()) age--;

    return age;
}

export function firstLetterToUppercase(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
}