import { MessageEmbed } from "discord.js";
import { colors } from "../../resources/config/information.json";
import { getChannelsByCategory } from "../api/func/MainChannel";
import { request } from "../api/Request";
import { getMember } from "../api/requests/Member";
import { Member } from "../api/Schema";
import { numberFormat } from "./Func";
import { Leaderboard } from "./Leaderboard";

type EmbedType = "normal" | "error";


export function simpleEmbed(message: string, type: EmbedType = "normal", title?: string) : MessageEmbed {
    return new MessageEmbed()
        .setDescription(message)
        // @ts-ignore : compatible with the type HexColorString in ColorResolvable, 
        // but not detected because of the use of a variable
        .setColor(type === "normal" ? colors.primary : colors.error)
        .setTitle(title ?? "");
}

export async function memberEmbed(memberId: string) : Promise<null|MessageEmbed> {

    const memberInfo = (await request<{ member: Member }>(getMember, { id: memberId })).member;
    if(!memberInfo) return null;

    const memberActivity = memberInfo.activity;

    let globalStats = "";
    globalStats += `**Temps de vocal (en minute) :** ${numberFormat(memberActivity.voiceMinute)}\n`;
    globalStats += `**Nombre de message :** ${numberFormat(memberActivity.messages.totalCount)}\n`;
    globalStats += `**Nombre de message ce mois :** ${numberFormat(memberActivity.messages.monthCount)}`;
    
    let messagesPerChannel = "**Nombre de message par salon :**\n";

    const channelsIdsByCategory = await getChannelsByCategory();

    for(const [category, channelIds] of Object.entries(channelsIdsByCategory)){

        channelIds.forEach(channelId => {

            const channelInfo = memberActivity.messages.perChannel.find(channel => channel?.channelId === channelId);

            if(!channelInfo) return;

            messagesPerChannel += `${numberFormat(channelInfo.messageCount)} dans <#${channelInfo.channelId}> (${category})\n`;
        });
    }

    return simpleEmbed(`${globalStats}\n\n${messagesPerChannel}`, "normal", `Activité de ${memberInfo.username}`);
}



export function leaderboardEmbed(title: string, leaderboard: Leaderboard, page: number = 1) : MessageEmbed {

    title += ` - ${leaderboard.getCorrectPageNum(page)}/${leaderboard.getMaxPage()}`;

    let descriptionOptions = [];

    const options = leaderboard.getOptions();

    // For futur leaderboard intervals
    switch(options.period){
        case "month":
            descriptionOptions.push("Mois actuel");
        break;
    }
    if(options.channel) descriptionOptions.push(`Dans <#${options.channel}>`);

    const embed = simpleEmbed(
        descriptionOptions.length ? `> ${descriptionOptions.join(" | ")}` : "",
        "normal",
        title
    );

    const pageEntries = leaderboard.getFormatedPage(page);

    embed.addField("\u200b", pageEntries.join("\n"));

    return embed;
}