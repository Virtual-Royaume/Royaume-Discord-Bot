import { HexColorString } from "discord.js";

export const isHexColor = (color: string): color is HexColorString => (/^#(?=[A-z0-9]*$)(?:.{3}|.{6})$/).test(color);