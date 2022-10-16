import { ChatInputCommandInteraction, GuildMember, SlashCommandBuilder, SlashCommandUserOption } from "discord.js";
import { getMember, GetMemberType, GetMemberVariables } from "$core/api/requests/Member";
import { simpleEmbed } from "$core/utils/Embed";
import Command from "$core/commands/Command";
import { getChannels, GetChannelsType } from "$core/api/requests/MainChannel";
import { dateFormat, firstLetterToUppercase, getAge, numberFormat, formatMinutes } from "$core/utils/Function";
import DayJS from "$core/utils/DayJS";
import { msg } from "$core/utils/Message";
import { gqlRequest } from "$core/utils/Request";
import { TierUpdate } from "$core/api/Schema";

export default class Member extends Command {

    public readonly slashCommand = new SlashCommandBuilder()
        .setName(msg("cmd-member-builder-name"))
        .setDescription(msg("cmd-member-builder-description"))
        .addUserOption(new SlashCommandUserOption()
            .setName(msg("cmd-member-builder-member-name"))
            .setDescription(msg("cmd-member-builder-member-description")));

    public async execute(command: ChatInputCommandInteraction): Promise<void> {
        const member = command.options.getMember(msg("cmd-member-builder-member-name")) ?? command.member;

        // Check :
        if (!(member instanceof GuildMember)) {
            command.reply({
                embeds: [simpleEmbed(msg("message-execution-error-cmd"))],
                ephemeral: true
            });
            return;
        }

        // Get member info :
        const memberInfo = (await gqlRequest<GetMemberType, GetMemberVariables>(getMember, { id: member.id })).data?.member;
        // Get main channels en sort it :
        const channels = (await gqlRequest<GetChannelsType, undefined>(getChannels)).data?.channels;

        if (!memberInfo || !channels) {
            command.reply({ embeds: [simpleEmbed(msg("cmd-member-exec-member-info-error"), "error")], ephemeral: true });
            return;
        }

        const channelsIdsByCategory: Record<string, string[]> = {};

        for (const channel of channels) {
            if (!channelsIdsByCategory[channel.category]) channelsIdsByCategory[channel.category] = [];

            channelsIdsByCategory[channel.category].push(channel.channelId);
        }

        // Format message :
        let message = "";

        if (memberInfo.birthday) {
            const birthday = DayJS(memberInfo.birthday).tz();

            message += msg("cmd-member-exec-member-birth", [dateFormat(birthday, "/"), getAge(birthday)]);
        }

        const memberActivity = memberInfo.activity;

        console.log(memberActivity.tier);


        switch (memberActivity.points.progress) {
            case TierUpdate.Up:
                message += msg("cmd-member-exec-member-progress-up");
                break;
            case TierUpdate.Neutral:
                message += msg("cmd-member-exec-member-progress-neutral");
                break;
            case TierUpdate.Down:
                message += msg("cmd-member-exec-member-progress-down");
                break;
        }

        message += msg("cmd-member-exec-member-activity", [
            formatMinutes(memberActivity.voiceMinute),
            formatMinutes(memberActivity.monthVoiceMinute),
            numberFormat(memberActivity.messages.totalCount),
            numberFormat(memberActivity.messages.monthCount)
        ]);

        const embed = simpleEmbed(message, "normal", msg("cmd-member-exec-embed-title", [member.displayName]));

        for (const [category, channelIds] of Object.entries(channelsIdsByCategory)) {
            embed.addFields([{
                name: firstLetterToUppercase(category),
                value: channelIds.map(channelId => {
                    const messageCount = memberInfo.activity.messages.perChannel
                        .find(channel => channel?.channelId === channelId)?.messageCount ?? 0;

                    return msg("cmd-member-exec-member-channel-activity", [messageCount, channelId]);
                }).join("\n")
            }]);
        }

        command.reply({
            embeds: [embed]
        });
    }
}