import type { CommandExecute } from "#/utils/handler/command";
import { getGuildTypeById, guilds } from "#/configs/guild";
import { commands } from "#/configs/message/command";
import { dayJS } from "#/configs/day-js";
import { simpleEmbed } from "#/utils/discord/embed";
import { dateFormat, formatMinutes, getAge } from "#/utils/function/date";
import { logger } from "#/utils/logger";
import { msgParams } from "#/utils/message";
import { gqlRequest } from "#/utils/request";
import { TierUpdate } from "#/utils/request/graphql";
import { userWithId } from "#/utils/discord/user";
import { GuildMember } from "discord.js";
import { numberFormat } from "#/utils/function/number";
import { firstLetterToUppercase } from "#/utils/function/string";
import { getMember } from "./member.gql";
import { getChannelsAsArray } from "#/utils/api/channel/channel.util";

export const execute: CommandExecute = async(command) => {
  const member = command.options.getMember(commands.member.options.member.name) ?? command.member;

  if (!(member instanceof GuildMember) || !command.guild) {
    void command.reply({
      embeds: [simpleEmbed(commands.member.exec.isntInGuild, "error")],
      ephemeral: true
    });
    return;
  }

  const guildType = getGuildTypeById(command.guild.id);

  if (!guildType) {
    void command.reply({
      embeds: [simpleEmbed(commands.member.exec.isntInOfficialGuild, "error")],
      ephemeral: true
    });
    return;
  }

  // Get member info :
  const memberQuery = await gqlRequest(getMember, { id: member.id });

  if (!memberQuery.ok) {
    void command.reply({
      embeds: [simpleEmbed(commands.member.exec.memberQueryError, "error")],
      ephemeral: true
    });
    return;
  }

  const memberInfo = memberQuery.value.member;

  if (!memberInfo) {
    void command.reply({
      embeds: [simpleEmbed(commands.member.exec.memberDoesntExist, "error")],
      ephemeral: true
    });
    return;
  }

  // Get main channels en sort it :
  const channelsQuery = await getChannelsAsArray();

  if (!channelsQuery.ok) {
    void command.reply({
      embeds: [simpleEmbed(commands.member.exec.channelsQueryError, "error")],
      ephemeral: true
    });
    return;
  }

  const channels = channelsQuery.value;
  const channelsIdsByCategory: Record<string, string[]> = {};

  for (const channel of channels) {
    if (!channelsIdsByCategory[channel.category]) channelsIdsByCategory[channel.category] = [];

    channelsIdsByCategory[channel.category].push(channel.channelId);
  }

  // Format message :
  let message = "";

  if (memberInfo.birthday) {
    const birthday = dayJS(memberInfo.birthday).tz();
    message += msgParams(commands.member.exec.embed.birth, [dateFormat(birthday, "/"), getAge(birthday)]);
  }

  const memberActivity = memberInfo.activity;
  const tiers: Record<string, string> = guilds[guildType].tiers;
  const tierRole = tiers[memberActivity.tier ?? ""];

  switch (memberActivity.points.progress) {
    case TierUpdate.Up:
      message += msgParams(commands.member.exec.embed.progress.up, [`<@&${tierRole}>`]);
      break;
    case TierUpdate.Neutral:
      message += msgParams(commands.member.exec.embed.progress.neutral, [`<@&${tierRole}>`]);
      break;
    case TierUpdate.Down:
      message += msgParams(commands.member.exec.embed.progress.down, [`<@&${tierRole}>`]);
      break;
  }

  message += msgParams(commands.member.exec.embed.activity, [
    formatMinutes(memberActivity.voiceMinute),
    formatMinutes(memberActivity.monthVoiceMinute),
    numberFormat(memberActivity.messages.totalCount),
    numberFormat(memberActivity.messages.monthCount)
  ]);

  const embed = simpleEmbed(message, "normal", msgParams(commands.member.exec.embed.title, [member.displayName]));

  for (const [category, channelIds] of Object.entries(channelsIdsByCategory)) {
    embed.addFields([{
      name: firstLetterToUppercase(category),
      value: channelIds.map(channelId => {
        const messageCount = memberInfo.activity.messages.perChannel
          .find(channel => channel?.channelId === channelId)?.messageCount ?? 0;

        return msgParams(commands.member.exec.embed.channelActivityRow, [messageCount, channelId]);
      }).join("\n")
    }]);
  }

  const banner = (await member.user.fetch()).bannerURL();
  if (banner) embed.setImage(banner + "?size=512");

  const avatar = (await member.user.fetch()).displayAvatarURL();
  if (avatar) embed.setThumbnail(avatar);

  void command.reply({
    embeds: [embed]
  });

  logger.info(`${userWithId(command.user)} used the command ${command.commandName} on ${userWithId(member.user)}`);
};