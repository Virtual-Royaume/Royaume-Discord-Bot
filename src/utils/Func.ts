import { request } from "../api/Request";
import { getChannelMessageCount, getMonthMessageCount, getTotalMessageCount, getVoiceTime } from "../api/requests/Member";
import { Member } from "../api/Schema";
import { Leaderboard, LeaderboardOptionsType } from "./Leaderboard";

export function numberFormat(number: number) : string {
    return number.toLocaleString("fr-FR");
}

export async function getMessageLeaderboard( options: LeaderboardOptionsType = {} ) : Promise<Leaderboard>{

    switch (options.period) {
        case "month":

            const monthMessageCount = ( await request<{ members: Member[] }>(getMonthMessageCount) ).members
            .map( member => {
                return {
                    username: member.username,
                    count: member.activity.messages.monthCount
                }
            });

            return new Leaderboard(monthMessageCount, undefined, options);
        break;
    }


    if(options.channel){

        const channelMessageCount = ( await request<{ members: Member[] }>(getChannelMessageCount) ).members
        .map(member => {
            const selectChannel = member.activity.messages.perChannel.find(c => options.channel === c?.channelId);

            return {
                username: member.username,
                count: selectChannel?.messageCount ?? 0
            }
        });

        return new Leaderboard(channelMessageCount, undefined, options);
    }


    const totalMessageCount = ( await request<{ members: Member[] }>(getTotalMessageCount) ).members
    .map(member => {
        return {
            username: member.username,
            count: member.activity.messages.totalCount
        }
    });

    return new Leaderboard(totalMessageCount);
}

export async function getVoiceLeaderboard( options: LeaderboardOptionsType = {} ) : Promise<Leaderboard>{

    switch (options.period) {
        case "month":

        // For futur feature

        break;
    }


    if(options.channel){

        // For futur feature
        
    }


    const totalVoiceCount = ( await request<{ members: Member[] }>(getVoiceTime) ).members
    .map(member => {
        return {
            username: member.username,
            count: member.activity.voiceMinute
        }
    });

    return new Leaderboard(totalVoiceCount);

}