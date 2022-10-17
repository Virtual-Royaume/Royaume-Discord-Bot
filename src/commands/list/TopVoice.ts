import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandSubcommandBuilder, SlashCommandNumberOption } from "discord.js";
import { msg } from "$core/utils/Message";
import { getMonthVoiceMinute, getVoiceTime } from "$core/api/requests/Member";
import { simpleEmbed } from "$core/utils/Embed";
import { formatMinutes } from "$core/utils/Function";
import Command from "$core/commands/Command";
import { gqlRequest } from "$core/utils/request";

export default class TopVoice extends Command {

    public readonly slashCommand = new SlashCommandBuilder()
        .setName(msg("cmd-topvoice-builder-name"))
        .setDescription(msg("cmd-topvoice-builder-description"))
        .addSubcommand(new SlashCommandSubcommandBuilder()
            .setName(msg("cmd-topvoice-builder-total-name"))
            .setDescription(msg("cmd-topvoice-builder-total-description"))
            .addNumberOption(new SlashCommandNumberOption()
                .setName(msg("cmd-topvoice-builder-page-name"))
                .setDescription(msg("cmd-topvoice-builder-page-description"))
                .setMinValue(1)))
        .addSubcommand(new SlashCommandSubcommandBuilder()
            .setName(msg("cmd-topvoice-builder-month-name"))
            .setDescription(msg("cmd-topvoice-builder-month-description"))
            .addNumberOption(new SlashCommandNumberOption()
                .setName(msg("cmd-topvoice-builder-page-name"))
                .setDescription(msg("cmd-topvoice-builder-page-description"))));

    private memberPerPage = 20;

    public async execute(command: ChatInputCommandInteraction): Promise<void> {
        let page = command.options.getNumber(msg("cmd-topvoice-builder-page-name")) ?? 1;

        // Get data and sort it :
        type Data = {
            username: string;
            voiceMinute: number;
        }

        let members: Data[] = [];

        switch (command.options.getSubcommand()) {
            case msg("cmd-topvoice-builder-total-name"): {
                members = (await gqlRequest(getMonthVoiceMinute)).data?.members.sort((a, b) => {
                    return (b?.activity.monthVoiceMinute ?? 0) - (a?.activity.monthVoiceMinute ?? 0);
                }).map(member => {
                    return {
                        username: member.username,
                        voiceMinute: member.activity.monthVoiceMinute
                    };
                }) ?? [];
                break;
            }

            case msg("cmd-topvoice-builder-month-name"): {
                members = (await gqlRequest(getVoiceTime)).data?.members.sort((a, b) => {
                    return (b?.activity.voiceMinute ?? 0) - (a?.activity.voiceMinute ?? 0);
                }).map(member => {
                    return {
                        username: member.username,
                        voiceMinute: member.activity.voiceMinute
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

            message += msg("cmd-topvoice-exec-embed-line", [i + 1 + (page - 1) * this.memberPerPage, member.username,
                formatMinutes(member.voiceMinute)
            ]);
        }

        // Send leaderboard :
        command.reply({
            embeds: [
                simpleEmbed(message, "normal", msg("cmd-topvoice-exec-embed-title", [command.options.getSubcommand(), page, maxPage]))
            ]
        });
    }
}