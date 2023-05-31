import { DayJS } from "$core/configs/day-js";
import { ConsoleEffect, ConsoleForground } from "./logger.enum";

export const logger = {
  info: (message: string) => {
    console.log(formatLog(ConsoleForground.Yellow, "info", message));
  },

  success: (message: string) => {
    console.log(formatLog(ConsoleForground.Green, "success", message));
  },

  error: (message: string) => {
    console.log(formatLog(ConsoleForground.Red, "error", message));
  }
};

export const formatLog = (color: ConsoleForground, type: string, message: string): string => {
  const maxSpace = 8;
  const spaceSize = maxSpace - type.length;

  const datetime = DayJS().format("YYYY-MM-DD HH:mm:ss");

  const prefix = `${ConsoleForground.White}[${datetime}] ${ConsoleEffect.Bold}${color}${type.toUpperCase()}`;
  const separator = `${ConsoleEffect.Reset} ${ConsoleForground.Gray}${"-".repeat(spaceSize)}» `;
  const content = `${ConsoleEffect.Reset}${message}`;

  return `${prefix}${separator}${content}`;
};