import { Dayjs } from "dayjs";
import { localFormat } from "../../resources/config/information.json";
import DayJS from "./DayJS";

export function numberFormat(number: number) : string {
    return number.toLocaleString(localFormat);
}

export function dateFormat(date: Dayjs, separator = "-") : string {
    return date.format(`DD[${separator}]MM[${separator}]YYYY`);
}

export function getAge(birth: Dayjs): number {
    return DayJS().tz().diff(birth, "year");
}

export function firstLetterToUppercase(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
}