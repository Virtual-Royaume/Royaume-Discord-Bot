import { HexColorString, EmbedBuilder } from "discord.js";
import { colors } from "$resources/config/information.json";

type EmbedType = "normal" | "error";

export function simpleEmbed(message: string, type: EmbedType = "normal", title?: string) : EmbedBuilder {
    return new EmbedBuilder()
        .setDescription(message)
        .setColor((type === "normal" ? colors.primary : colors.error) as HexColorString)
        .setTitle(title ?? "");
}