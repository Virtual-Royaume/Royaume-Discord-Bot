import type { Dayjs } from "dayjs";
import { DayJS } from "#/configs/day-js";

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