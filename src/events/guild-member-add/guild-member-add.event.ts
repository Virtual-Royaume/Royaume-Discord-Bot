import type { EventExecute, EventName } from "$core/utils/handler/event";
import { createMember, getMemberActivityTier, setAlwaysOnServer } from "$core/api/requests/member";
import { guilds } from "$core/configs/guild";
import { events } from "$core/configs/message/event";
import { defaultAvatar } from "./guild-member-add.const";
import { simpleEmbed } from "$core/utils/embed";
import { logger } from "$core/utils/logger";
import { msgParams } from "$core/utils/message";
import { gqlRequest } from "$core/utils/request";
import { ChannelType } from "discord.js";
import { userWithId } from "$core/utils/user";

export const event: EventName = "guildMemberAdd";

export const execute: EventExecute<"guildMemberAdd"> = async(member) => {
  if (member.user.bot) return;

  // Create the member if he doesn't exist :
  const response = await gqlRequest(createMember, {
    id: member.id,
    username: member.user.username,
    profilePicture: member.user.avatarURL() ?? defaultAvatar
  });

  if (response.ok && !response.value.createMember) void gqlRequest(setAlwaysOnServer, { id: member.id, value: true });

  // Stop here if is game server:
  if (member.guild.id !== guilds.pro.guildId) return;

  const guild = member.guild;

  // Add verification role :
  if (guilds.pro.isPrivate) {
    const role = await guild.roles.fetch(guilds.pro.roles.waiting);

    try {
      if (role) void member.roles.add(role);
      logger.info(`Member ${userWithId(member.user)} added to waiting role`);
    } catch (e) {
      logger.error(`Error while updating member ${member?.user.id} roles : ${String(e)}`);
    }
    return;
  }

  const channel = await guild.channels.fetch(guilds.pro.channels.general);

  if (channel?.type === ChannelType.GuildText) {
    const embed = simpleEmbed(events.guildMemberAdd.welcomePresentation);
    const embeds = [];

    try {
      await member.send({ embeds: [embed] });
    } catch (error) {
      embeds.push(embed);
    }

    void (await channel.send({ content: msgParams(events.guildMemberAdd.welcomePresentation, [member.id]), embeds })).react("👋");
  }

  const tierQuery = await gqlRequest(getMemberActivityTier, {
    memberId: member.id
  });

  if (!tierQuery.ok || !tierQuery.value.member) return;

  const tiers: Record<string, string> = guilds.pro.tiers;

  if (tierQuery.value.member.activity.tier) {
    try {
      void member.roles.add(tiers[tierQuery.value.member.activity.tier]);
      logger.info(`Member ${userWithId(member.user)} added to tier ${tierQuery.value.member.activity.tier}`);
    } catch (e) {
      logger.error(`Error while updating member ${member?.user.id} roles : ${String(e)}`);
    }
  }

};