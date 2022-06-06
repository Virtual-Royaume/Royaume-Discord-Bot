import { MessageEmbed } from "discord.js";
import { colors } from "../../resources/config/information.json";

type EmbedType = "normal" | "error";

export function simpleEmbed(message: string, type: EmbedType = "normal", title?: string) : MessageEmbed {
    return new MessageEmbed()
        .setDescription(message)
        // @ts-ignore : compatible with the type HexColorString in ColorResolvable,
        // but not detected because of the use of a variable
        .setColor(type === "normal" ? colors.primary : colors.error)
        .setTitle(title ?? "");
}