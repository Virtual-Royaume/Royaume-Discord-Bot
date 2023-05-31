import type { Dayjs } from "dayjs";
import { global } from "$core/configs/global";
import { DayJS } from "$core/utils/day-js";
import { existsSync, statSync } from "fs";

export const numberFormat = (number: number): string => {
  return number.toLocaleString(global.localFormat);
};

export const dateFormat = (date: Dayjs, separator = "-"): string => {
  return date.format(`DD[${separator}]MM[${separator}]YYYY`);
};

export const formatMinutes = (minutes: number): string => {
  const days = Math.floor(minutes / (60 * 24));
  const hours = Math.floor(minutes % (60 * 24) / 60);

  minutes = Math.floor(minutes % 60);

  const format = [];

  if (days) format.push(`${days} jours`);
  if (hours) format.push(`${hours} heures`);
  if (minutes) format.push(`${minutes} minutes`);
  if (!format.length) format.push("0 minutes");

  return format.join(", ").replace(/(, )(?=[^,]*$)/, " et ");
};

export const getAge = (birth: Dayjs): number => {
  return DayJS().tz().diff(birth, "year");
};

export const firstLetterToUppercase = (string: string): string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const doesFolderExist = (path: string): boolean => {
  return existsSync(path) && statSync(path).isDirectory();
};

export const objectKeys = <T extends object>(obj: T): (keyof T)[] => {
  return Object.keys(obj) as (keyof T)[];
};