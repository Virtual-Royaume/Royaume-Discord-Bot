import {
    SlashCommandBuilder, SlashCommandChannelOption,
    SlashCommandNumberOption, SlashCommandStringOption
} from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { request } from "../../api/Request";
import {
    getChannelMessageCount, GetChannelMessageCountType,
    getMonthMessageCount, GetMonthMessageCountType,
    getTotalMessageCount, GetTotalMessageType
} from "../../api/requests/Member";
import { simpleEmbed } from "../../utils/Embed";
import { numberFormat } from "../../utils/Function";
import { msg } from "../../utils/Message";
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
        .setName(msg("cmd-topmessages-builder-name"))
        .setDescription(msg("cmd-topmessages-builder-description"))
        .addStringOption(new SlashCommandStringOption()
            .setName(msg("cmd-topmessages-builder-source-name"))
            .setDescription(msg("cmd-topmessages-builder-source-description"))
            .addChoices(...this.sourceChoices)
            .setRequired(true)).addNumberOption(new SlashCommandNumberOption()
            .setName(msg("cmd-topmessages-builder-page-name"))
            .setDescription(msg("cmd-topmessages-builder-page-description"))
            .setMinValue(1)).addChannelOption(new SlashCommandChannelOption()
            .setName(msg("cmd-topmessages-builder-channel-name"))
            .setDescription(msg("cmd-topmessages-builder-channel-description"))
            .addChannelTypes(0));

    private memberPerPage = 20;

    public async execute(command: CommandInteraction) : Promise<void> {
        const source: Source = <Source>command.options.getString(msg("cmd-topmessages-builder-source-name"), true);
        let page = command.options.getNumber(msg("cmd-topmessages-builder-page-name")) ?? 1;

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
                const channel = command.options.getChannel(msg("cmd-topmessages-builder-channel-name"), true);

                if (!channel) {
                    command.reply({ embeds: [simpleEmbed(msg("cmd-topmessage-exec-error-need-mention"), "error")], ephemeral: true });
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

            message += msg("cmd-topmessages-exec-embed-line", [i + 1 + (page - 1) * this.memberPerPage, member.username,
                numberFormat(member.messageCount)
            ]);
        }

        // Send leaderboard :
        command.reply({
            embeds: [
                simpleEmbed(message, "normal", msg("cmd-topmessages-exec-embed-title", [source, page, maxPage]))
            ]
        });
    }
}