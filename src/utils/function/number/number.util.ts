import { global } from "#/configs/global";

export const numberFormat = (number: number): string => {
  return number.toLocaleString(global.localFormat);
};