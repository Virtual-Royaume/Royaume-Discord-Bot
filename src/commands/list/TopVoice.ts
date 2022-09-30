import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandNumberOption, SlashCommandStringOption } from "discord.js";
import { msg } from "$core/utils/Message";
import { request } from "$core/api/Request";
import { getMonthVoiceMinute, GetMonthVoiceMinuteType, getVoiceTime, GetVoiceTimeType } from "$core/api/requests/Member";
import { simpleEmbed } from "$core/utils/Embed";
import { formatMinutes } from "$core/utils/Function";
import Command from "$core/commands/Command";

type Source = "total" | "mois";

interface SourceChoice {
    name: string;
    value: Source;
}

export default class TopVoice extends Command {

    private sourceChoices: SourceChoice[] = [
        { name: "Total", value: "total" },
        { name: "Mois", value: "mois" }
    ];

    public readonly slashCommand = new SlashCommandBuilder()
        .setName(msg("cmd-topvoice-builder-name"))
        .setDescription(msg("cmd-topvoice-builder-description"))
        .addStringOption(new SlashCommandStringOption()
            .setName(msg("cmd-topvoice-builder-source-name"))
            .setDescription(msg("cmd-topvoice-builder-source-description"))
            .addChoices(...this.sourceChoices)
            .setRequired(true)).addNumberOption(new SlashCommandNumberOption()
            .setName(msg("cmd-topvoice-builder-page-name"))
            .setDescription(msg("cmd-topvoice-builder-page-description"))
            .setMinValue(1));

    private memberPerPage = 20;

    public async execute(command: ChatInputCommandInteraction) : Promise<void> {
        const source: Source = <Source>command.options.getString(msg("cmd-topvoice-builder-source-name"), true);
        let page = command.options.getNumber(msg("cmd-topvoice-builder-page-name")) ?? 1;

        // Get data and sort it :
        interface Data {
            username: string;
            voiceMinute: number;
        }

        let members: Data[] = [];

        switch (source) {
            case "mois": {
                members = (await request<GetMonthVoiceMinuteType>(getMonthVoiceMinute)).members.sort((a, b) => {
                    return (b?.activity.monthVoiceMinute ?? 0) - (a?.activity.monthVoiceMinute ?? 0);
                }).map(member => {
                    return {
                        username: member.username,
                        voiceMinute: member.activity.monthVoiceMinute
                    };
                });
                break;
            }

            case "total": {
                members = (await request<GetVoiceTimeType>(getVoiceTime)).members.sort((a, b) => {
                    return (b?.activity.voiceMinute ?? 0) - (a?.activity.voiceMinute ?? 0);
                }).map(member => {
                    return {
                        username: member.username,
                        voiceMinute: member.activity.voiceMinute
                    };
                });
                break;
            }
        }

        // Get page and max page :
        const maxPage = Math.ceil(members.length / this.memberPerPage);
        page = page > maxPage ? maxPage : page;

        // Slice the members with page and max page :
        members = members.slice(page * this.memberPerPage - this.memberPerPage, page * this.memberPerPage);

        // Format leaderboard :
        let message = "";

        for (let i = 0; i < members.length; i++) {
            const member = members[i];

            message += msg("cmd-topvoice-exec-embed-line", [i + 1 + (page - 1) * this.memberPerPage, member.username,
                formatMinutes(member.voiceMinute)
            ]);
        }

        // Send leaderboard :
        command.reply({
            embeds: [
                simpleEmbed(message, "normal", msg("cmd-topvoice-exec-embed-title", [source, page, maxPage]))
            ]
        });
    }
}