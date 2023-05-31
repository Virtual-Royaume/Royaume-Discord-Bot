import { EmbedBuilder } from "discord.js";
import { global } from "#/configs/global";

type EmbedType = "normal" | "error";

export const simpleEmbed = (message: string, type: EmbedType = "normal", title?: string): EmbedBuilder => {
  const embed = new EmbedBuilder();

  const color = type === "normal" ? global.colors.primary : global.colors.error;
  embed.setColor(color);

  if (message) embed.setDescription(message);
  if (title) embed.setTitle(title);

  return embed;
};