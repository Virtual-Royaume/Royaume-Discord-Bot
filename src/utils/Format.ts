import { localFormat } from "../../resources/config/information.json";

export function numberFormat(number: number) : string {
    return number.toLocaleString(localFormat);
}

export function dateFormat(date: Date, separator = "-") : string {
    return date.toLocaleDateString(localFormat).replaceAll("/", separator);
}