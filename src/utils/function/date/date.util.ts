import type { Dayjs } from "#/configs/day-js";
import { dayJS } from "#/configs/day-js";

export const dateFormat = (date: Dayjs, separator = "-"): string => {
  return date.format(`DD[${separator}]MM[${separator}]YYYY`);
};

export const formatMinutes = (minutes: number): string => {
  const isNegative = minutes < 0;
  minutes = Math.abs(minutes);

  const days = Math.floor(minutes / (60 * 24));
  const hours = Math.floor(minutes % (60 * 24) / 60);
  minutes = Math.floor(minutes % 60);

  const format = [];

  if (days) format.push(`${days} jours`);
  if (hours) format.push(`${hours} heures`);
  if (minutes) format.push(`${minutes} minutes`);
  if (!format.length) format.push("0 minutes");

  const formatTime = isNegative ? `-${format.join(", ")}` : format.join(", ");

  return formatTime.replace(/(, )(?=[^,]*$)/, " et ");
};

export const getAge = (birth: Dayjs): number => {
  return dayJS().tz().diff(birth, "year");
};