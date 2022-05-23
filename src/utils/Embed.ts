import { MessageEmbed } from "discord.js";
import { colors } from "../../resources/config/information.json";
import { getChannelsByCategory } from "../api/func/MainChannel";
import { request } from "../api/Request";
import { getMember } from "../api/requests/Member";
import { Member } from "../api/Schema";
import { getMessageLeaderboard, getVoiceLeaderboard, LeaderboardEntryType, numberParser } from "./Func";
import Leaderboard from "./Leaderboard";

const PAGE_LENGTH = 20;

type EmbedType = "normal" | "error";

type LeaderboardType = "message" | "voice";

export type LeaderboardOptionsType = {
    period?: "month",
    channel?: string
}


export function simpleEmbed(message: string, type: EmbedType = "normal", title?: string) : MessageEmbed {
    return new MessageEmbed()
        .setDescription(message)
        // @ts-ignore : compatible with the type HexColorString in ColorResolvable, 
        // but not detected because of the use of a variable
        .setColor(type === "normal" ? colors.primary : colors.error)
        .setTitle(title ?? "");
}

export async function memberEmbed( memberId: string ) : Promise<null|MessageEmbed> {

    const memberInfo = (await request<{ member: Member }>(getMember, { id: memberId })).member;
    if(!memberInfo) return null;

    const memberActivity = memberInfo.activity;

    let globalStats = "";
    globalStats += `**Temps de vocal (en minute) :** ${numberParser(memberActivity.voiceMinute)}\n`;
    globalStats += `**Nombre de message :** ${numberParser(memberActivity.messages.totalCount)}\n`;
    globalStats += `**Nombre de message ce mois :** ${numberParser(memberActivity.messages.monthCount)}`;
    
    let messagesPerChannel = "**Nombre de message par salon :**\n";

    const channelsIdsByCategory = await getChannelsByCategory();

    for(const [category, channelIds] of Object.entries(channelsIdsByCategory)){

        channelIds.forEach(channelId => {

            const channelInfo = memberActivity.messages.perChannel.find(channel => channel?.channelId === channelId);

            if(!channelInfo) return;

            messagesPerChannel += `${numberParser(channelInfo.messageCount)} dans <#${channelInfo.channelId}> (${category})\n`;
        });
    }

    return simpleEmbed( `${globalStats}\n\n${messagesPerChannel}`, "normal", `Activité de ${memberInfo.username}` );
}





export async function leaderboardEmbed(type: LeaderboardType, page: number = 1, options: LeaderboardOptionsType = {}) : Promise<MessageEmbed> {

    let leaderboard: Leaderboard;
    let title = "";

    // SwitchCase for futur leaderboards
    switch (type) {
        case "message":
            leaderboard = await getMessageLeaderboard(options);
            title += "Classements des membres les plus actifs";
        break;
        case "voice":
            leaderboard = await getVoiceLeaderboard(options);
            title += "Classements des membres les plus actifs en vocal (en minute)";
        break;
    }
    title += ` - ${leaderboard.getCorrectPageNum(page)}/${leaderboard.getMaxPage()}`;

    let descriptionOptions = [];

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

    const pageEntries = leaderboard.getPage(page).map( (member, i) => {

        const position = (page-1)*leaderboard.getPageLength() + i + 1;

        return `**${position} • ${member.username} :** ${member.count}`;
    });

    embed.addField("\u200b", pageEntries.join("\n"));

    return embed;
}