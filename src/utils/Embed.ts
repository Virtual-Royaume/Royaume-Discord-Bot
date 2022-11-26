import { HexColorString, EmbedBuilder } from "discord.js";
import { colors } from "$resources/config/information.json";

type EmbedType = "normal" | "error";

export function simpleEmbed(message: string, type: EmbedType = "normal", title?: string): EmbedBuilder {
  const embed = new EmbedBuilder().setColor((type === "normal" ? colors.primary : colors.error) as HexColorString);

  if (message) embed.setDescription(message);
  if (title) embed.setTitle(title);

  return embed;
}