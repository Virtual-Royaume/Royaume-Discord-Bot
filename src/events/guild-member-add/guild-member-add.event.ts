import type { EventExecute, EventName } from "#/utils/handler/event";
import { guilds } from "#/configs/guild";
import { events } from "#/configs/message/event";
import { defaultAvatar } from "./guild-member-add.const";
import { simpleEmbed } from "#/utils/discord/embed";
import { logger } from "#/utils/logger";
import { msgParams } from "#/utils/message";
import { gqlRequest } from "#/utils/request";
import { ChannelType } from "discord.js";
import { userWithId } from "#/utils/discord/user";
import { createMember, getMemberActivityTier, setAlwaysOnServer } from "./guild-member-add.gql";

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