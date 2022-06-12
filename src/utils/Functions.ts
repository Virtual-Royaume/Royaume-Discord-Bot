import { localFormat } from "../../resources/config/information.json";

export function numberFormat(number: number) : string {
    return number.toLocaleString(localFormat);
}

export function dateFormat(date: Date, separator = "-") : string {
    return date.toLocaleDateString(localFormat).replaceAll("/", separator);
}

export function getAge(birthday: Date): number {
    const now = new Date();
    const months = now.getMonth() - birthday.getMonth();
    let age = now.getFullYear() - birthday.getFullYear();
    if (months < 0 || months === 0 && now.getDate() < birthday.getDate()) age--;
    return age;
}