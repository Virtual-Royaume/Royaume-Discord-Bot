import { createMember, getMemberActivityTier, setAlwaysOnServer } from "$core/api/requests/member";
import { guilds } from "$core/configs/guild";
import { events } from "$core/configs/message/event";
import { defaultAvatar } from "$core/events/guild-member-add/guild-member-add.util";
import { simpleEmbed } from "$core/utils/embed";
import { EnableInDev } from "$core/utils/handler";
import { EventExecute, EventName } from "$core/utils/handler/event";
import { logger } from "$core/utils/logger";
import { msgParams } from "$core/utils/message";
import { gqlRequest } from "$core/utils/request";
import { ChannelType } from "discord.js";

export const enableInDev: EnableInDev = true;

export const event: EventName = "guildMemberAdd";

export const execute: EventExecute<"guildMemberAdd"> = async(member) => {
  if (member.user.bot) return;

  // Create the member if he doesn't exist :
  const response = await gqlRequest(createMember, {
    id: member.id,
    username: member.user.username,
    profilePicture: member.user.avatarURL() ?? defaultAvatar
  });

  if (response.success && !response.data.createMember) gqlRequest(setAlwaysOnServer, { id: member.id, value: true });

  // Stop here if is game server:
  if (member.guild.id !== guilds.pro.guildId) return;

  const guild = member.guild;

  // Add verification role :
  if (guilds.pro.isPrivate) {
    const role = await guild.roles.fetch(guilds.pro.roles.waiting);

    try {
      if (role) member.roles.add(role);
    } catch (e) {
      logger.error(`Error while updating member ${member?.user.id} roles : ${e}`);
    }
    return;
  }

  const channel = await guild.channels.fetch(guilds.pro.channels.general);

  if (channel?.type === ChannelType.GuildText) {
    const embed = simpleEmbed(events.guildMemberAdd.welcomePresentation); // TODO : error if undefined ID
    const embeds = [];

    try {
      await member.send({ embeds: [embed] });
    } catch (error) {
      embeds.push(embed);
    }

    (await channel.send({ content: msgParams(events.guildMemberAdd.welcomePresentation, [member.id]), embeds })).react("👋");
  }

  const tierQuery = await gqlRequest(getMemberActivityTier, {
    memberId: member.id
  });

  if (!tierQuery.success || !tierQuery.data.member) return;

  const tiers: Record<string, string> = guilds.pro.tiers;

  if (tierQuery.data.member.activity.tier) {
    try {
      member.roles.add(tiers[tierQuery.data.member.activity.tier]);
    } catch (e) {
      logger.error(`Error while updating member ${member?.user.id} roles : ${e}`);
    }
  }

};