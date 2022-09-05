import { HexColorString, MessageEmbed } from "discord.js";
import { colors } from "$resources/config/information.json";

type EmbedType = "normal" | "error";

export function simpleEmbed(message: string, type: EmbedType = "normal", title?: string) : MessageEmbed {
    return new MessageEmbed()
        .setDescription(message)
        .setColor((type === "normal" ? colors.primary : colors.error) as HexColorString)
        .setTitle(title ?? "");
}