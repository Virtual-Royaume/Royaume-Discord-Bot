import {
    ChannelType,
    ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandSubcommandBuilder,
    SlashCommandChannelOption, SlashCommandNumberOption, SlashCommandStringOption
} from "discord.js";
import {
    getChannelMessageCount, GetChannelMessageCountType,
    getMonthMessageCount, GetMonthMessageCountType,
    getTotalMessageCount, GetTotalMessageType
} from "$core/api/requests/Member";
import { simpleEmbed } from "$core/utils/Embed";
import { numberFormat } from "$core/utils/Function";
import Command from "$core/commands/Command";
import { msg } from "$core/utils/Message";
import { gqlRequest } from "$core/utils/Request";

export default class TopMessage extends Command {

    public readonly slashCommand = new SlashCommandBuilder()
        .setName(msg("cmd-topmessages-builder-name"))
        .setDescription(msg("cmd-topmessages-builder-description"))
        .addSubcommand(new SlashCommandSubcommandBuilder()
            .setName(msg("cmd-topmessages-builder-total-name"))
            .setDescription(msg("cmd-topmessages-builder-total-description"))
            .addNumberOption(new SlashCommandNumberOption()
                .setName(msg("cmd-topmessages-builder-page-name"))
                .setDescription(msg("cmd-topmessages-builder-page-description"))
                .setMinValue(1)))
        .addSubcommand(new SlashCommandSubcommandBuilder()
            .setName(msg("cmd-topmessages-builder-month-name"))
            .setDescription(msg("cmd-topmessages-builder-month-description"))
            .addNumberOption(new SlashCommandNumberOption()
                .setName(msg("cmd-topmessages-builder-page-name"))
                .setDescription(msg("cmd-topmessages-builder-page-description"))
                .setMinValue(1)))
        .addSubcommand(new SlashCommandSubcommandBuilder()
            .setName(msg("cmd-topmessages-builder-channel-name"))
            .setDescription(msg("cmd-topmessages-builder-channel-description"))
            .addChannelOption(new SlashCommandChannelOption()
                .setName(msg("cmd-topmessages-builder-channel-name"))
                .setDescription(msg("cmd-topmessages-builder-channel-description"))
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(true))
            .addNumberOption(new SlashCommandNumberOption()
                .setName(msg("cmd-topmessages-builder-page-name"))
                .setDescription(msg("cmd-topmessages-builder-page-description"))
                .setMinValue(1)));

    private memberPerPage = 20;

    public async execute(command: ChatInputCommandInteraction): Promise<void> {
        let page = command.options.getNumber(msg("cmd-topmessages-builder-page-name")) ?? 1;

        // Get data and sort it :
        type Data = {
            username: string;
            messageCount: number;
        }

        let members: Data[] = [];

        switch (command.options.getSubcommand()) {
            case msg("cmd-topmessages-builder-month-name"): {
                members = (await gqlRequest<GetMonthMessageCountType, undefined>(getMonthMessageCount)).data?.members.sort((a, b) => {
                    return (b?.activity.messages.monthCount ?? 0) - (a?.activity.messages.monthCount ?? 0);
                }).map(member => {
                    return {
                        username: member.username,
                        messageCount: member.activity.messages.monthCount
                    };
                }) ?? [];
                break;
            }

            case msg("cmd-topmessages-builder-total-name"): {
                members = (await gqlRequest<GetTotalMessageType, undefined>(getTotalMessageCount)).data?.members.sort((a, b) => {
                    return (b?.activity.messages.totalCount ?? 0) - (a?.activity.messages.totalCount ?? 0);
                }).map(member => {
                    return {
                        username: member.username,
                        messageCount: member.activity.messages.totalCount
                    };
                }) ?? [];
                break;
            }

            case msg("cmd-topmessages-builder-channel-name"): {
                const channel = command.options.getChannel(msg("cmd-topmessages-builder-channel-name"), true);

                if (!channel) {
                    command.reply({ embeds: [simpleEmbed(msg("cmd-topmessage-exec-error-need-mention"), "error")], ephemeral: true });
                    return;
                }

                members = (await gqlRequest<GetChannelMessageCountType, undefined>(getChannelMessageCount)).data?.members.sort((a, b) => {
                    const aChannel = a.activity.messages.perChannel.find(c => channel.id === c?.channelId);
                    const bChannel = b.activity.messages.perChannel.find(c => channel.id === c?.channelId);

                    return (bChannel?.messageCount ?? 0) - (aChannel?.messageCount ?? 0);
                }).map(member => {
                    const selectChannel = member.activity.messages.perChannel.find(c => channel.id === c?.channelId);

                    return {
                        username: member.username,
                        messageCount: selectChannel?.messageCount ?? 0
                    };
                }) ?? [];
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
                simpleEmbed(message, "normal", msg("cmd-topmessages-exec-embed-title", [command.options.getSubcommand(), page, maxPage]))
            ]
        });
    }
}