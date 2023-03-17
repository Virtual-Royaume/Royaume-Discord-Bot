import { EmbedBuilder } from "discord.js";
import { global } from "$core/configs/global.config";
import { isHexColor } from "./validator";

type EmbedType = "normal" | "error";

export const simpleEmbed = (message: string, type: EmbedType = "normal", title?: string): EmbedBuilder => {
  const color = type === "normal" ? global.colors.primary : global.colors.error;

  if (!isHexColor(color)) throw new Error("Invalid config: \"colors\" field in information.json need to be a valid hex color code");

  const embed = new EmbedBuilder().setColor(color);

  if (message) embed.setDescription(message);
  if (title) embed.setTitle(title);

  return embed;
};