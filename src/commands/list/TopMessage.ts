import {
    SlashCommandBuilder, SlashCommandChannelOption,
    SlashCommandNumberOption, SlashCommandStringOption
} from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { ChannelTypes } from "discord.js/typings/enums";
import { request } from "../../api/Request";
import {
    getChannelMessageCount, GetChannelMessageCountType,
    getMonthMessageCount, GetMonthMessageCountType,
    getTotalMessageCount, GetTotalMessageType
} from "../../api/requests/Member";
import { simpleEmbed } from "../../utils/Embed";
import { numberFormat } from "../../utils/Format";
import Command from "../Command";

type Source = "total" | "mois" | "salon";

interface SourceChoice {
    name: string;
    value: Source;
}

export default class TopMessage extends Command {

    private sourceChoices: SourceChoice[] = [
        { name: "Total", value: "total" },
        { name: "Mois", value: "mois" },
        { name: "Salon", value: "salon" }
    ];

    public readonly slashCommand = new SlashCommandBuilder()
        .setName("top-message")
        .setDescription("Voir le classement des membres les plus actifs en terme de nombre de message")
        .addStringOption(new SlashCommandStringOption()
            .setName("source")
            .setDescription("Source du classement")
            .addChoices(...this.sourceChoices)
            .setRequired(true)).addNumberOption(new SlashCommandNumberOption()
            .setName("page")
            .setDescription("Page du classement")
            .setMinValue(1)).addChannelOption(new SlashCommandChannelOption()
            .setName("salon")
            .setDescription("Choix du salon si vous avez choisi \"salon\" comme source")
            // @ts-ignore : DJS - DJS/builders typing version problem
            .addChannelTypes(ChannelTypes.GUILD_TEXT));

    public readonly defaultPermission: boolean = true;

    private memberPerPage = 20;

    public async execute(command: CommandInteraction) : Promise<void> {
        const source: Source = <Source>command.options.getString("source", true);
        let page = command.options.getNumber("page") ?? 1;

        // Get data and sort it :
        interface Data {
            username: string;
            messageCount: number;
        }

        let members: Data[] = [];

        switch (source) {
            case "mois": {
                members = (await request<GetMonthMessageCountType>(getMonthMessageCount)).members.sort((a, b) => {
                    return (b?.activity.messages.monthCount ?? 0) - (a?.activity.messages.monthCount ?? 0);
                }).map(member => {
                    return {
                        username: member.username,
                        messageCount: member.activity.messages.monthCount
                    };
                });
                break;
            }

            case "total": {
                members = (await request<GetTotalMessageType>(getTotalMessageCount)).members.sort((a, b) => {
                    return (b?.activity.messages.totalCount ?? 0) - (a?.activity.messages.totalCount ?? 0);
                }).map(member => {
                    return {
                        username: member.username,
                        messageCount: member.activity.messages.totalCount
                    };
                });
                break;
            }

            case "salon": {
                const channel = command.options.getChannel("salon");

                if (!channel) {
                    command.reply({ embeds: [simpleEmbed("Vous devez mentionner un salon.", "error")], ephemeral: true });
                    return;
                }

                members = (await request<GetChannelMessageCountType>(getChannelMessageCount)).members.sort((a, b) => {
                    const aChannel = a.activity.messages.perChannel.find(c => channel.id === c?.channelId);
                    const bChannel = b.activity.messages.perChannel.find(c => channel.id === c?.channelId);

                    return (bChannel?.messageCount ?? 0) - (aChannel?.messageCount ?? 0);
                }).map(member => {
                    const selectChannel = member.activity.messages.perChannel.find(c => channel.id === c?.channelId);

                    return {
                        username: member.username,
                        messageCount: selectChannel?.messageCount ?? 0
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

            message += `**${i + 1 + (page - 1) * this.memberPerPage}. ${member.username} :** ${numberFormat(member.messageCount)}\n`;
        }

        // Send leaderboard :
        command.reply({
            embeds: [simpleEmbed(message, "normal", `Classements des membres les plus actifs (${source}) (page : ${page}/${maxPage})`)]
        });
    }
}