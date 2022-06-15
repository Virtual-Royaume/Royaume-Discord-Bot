import { SlashCommandBuilder, SlashCommandNumberOption, SlashCommandStringOption } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { request } from "../../api/Request";
import { getMonthVoiceMinute, GetMonthVoiceMinuteType, getVoiceTime, GetVoiceTimeType } from "../../api/requests/Member";
import { simpleEmbed } from "../../utils/Embed";
import { minuteToHour } from "../../utils/Function";
import Command from "../Command";

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
        .setName("top-voice")
        .setDescription("Voir le classement des membres les plus actifs en vocal")
        .addStringOption(new SlashCommandStringOption()
            .setName("source")
            .setDescription("Source du classement")
            .addChoices(...this.sourceChoices)
            .setRequired(true)).addNumberOption(new SlashCommandNumberOption()
            .setName("page")
            .setDescription("Page du classement")
            .setMinValue(1));

    public readonly defaultPermission: boolean = true;

    private memberPerPage = 20;

    public async execute(command: CommandInteraction) : Promise<void> {
        const source: Source = <Source>command.options.getString("source", true);
        let page = command.options.getNumber("page") ?? 1;

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

            message += `**${i + 1 + (page - 1) * this.memberPerPage}. ${member.username} :** ${minuteToHour(member.voiceMinute)}\n`;
        }

        // Send leaderboard :
        command.reply({
            embeds: [
                simpleEmbed(message, "normal", `Classements des membres les plus actifs en vocal (en minute) (${source}) (page : ${page}/${maxPage})`)
            ]
        });
    }
}