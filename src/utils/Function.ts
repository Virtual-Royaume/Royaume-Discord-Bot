import { Dayjs } from "dayjs";
import { localFormat } from "../../resources/config/information.json";
import DayJS from "./DayJS";

export function numberFormat(number: number): string {
    return number.toLocaleString(localFormat);
}

export function dateFormat(date: Dayjs, separator = "-"): string {
    return date.format(`DD[${separator}]MM[${separator}]YYYY`);
}

export function formatMinutes(minutes: number): string {
    const days = Math.floor(minutes / (60 * 24));
    const hours = Math.floor(minutes % (60 * 24) / 60);

    minutes = Math.floor(minutes % 60);

    const format = [];

    if (days) format.push(`${days} jours`);
    if (hours) format.push(`${hours} heures`);
    if (minutes) format.push(`${minutes} minutes`);
    if (!format.length) format.push("0 minutes");

    return format.join(", ").replace(/(, )(?=[^,]*$)/, " et ");
}

export function getAge(birth: Dayjs): number {
    return DayJS().tz().diff(birth, "year");
}

export function firstLetterToUppercase(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
}