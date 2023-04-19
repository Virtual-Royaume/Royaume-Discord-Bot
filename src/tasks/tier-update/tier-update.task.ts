import { getMembersTier } from "$core/api/requests/member";
import { client } from "$core/client";
import { getGuild, guilds } from "$core/configs/guild";
import { tasks } from "$core/configs/message/task/task.config";
import type { RoleUpdate } from "./tier-update.type";
import { simpleEmbed } from "$core/utils/embed";
import type { TaskExecute, TaskInterval } from "$core/utils/handler/task";
import { logger } from "$core/utils/logger";
import { msgParams } from "$core/utils/message";
import { gqlRequest } from "$core/utils/request";
import { BaseGuildTextChannel } from "discord.js";
import { userWithId } from "$core/utils/user";
import { getGuildMembers } from "$core/utils/discord/guild";

export const interval: TaskInterval = "0 * * * * *";

export const execute: TaskExecute = async() => {
  const guild = await getGuild(client, "pro");
  const tiers: Record<string, string> = guilds.pro.tiers;
  const discordMembers = await getGuildMembers(guild);
  const apiMembersQuery = await gqlRequest(getMembersTier);

  if (!discordMembers) {
    logger.error("Tier update task fail for PRO server, unable to fetch guild members");
    return;
  }

  if (!apiMembersQuery.success) {
    logger.error("Tier update task fail for PRO server, the API does not respond");
    return;
  }

  const updates: RoleUpdate[] = [];

  // Check if the member have the right role :
  for (const [id, member] of discordMembers) {
    if (member.user.bot || member.roles.cache.has(guilds.pro.roles.waiting)) continue;

    const tierRole = tiers[apiMembersQuery.data.members.find(element => element._id === id)?.activity.tier.toString() ?? ""];

    if (!tierRole) return logger.error(`Undefined role tier for member ${member.id} ${member.displayName}`);

    const otherRoles = Object.values(tiers).filter(role => role !== tierRole);

    if (!member.roles.cache.has(tierRole) || member.roles.cache.hasAny(...otherRoles)) {
      const oldRole = member.roles.cache.filter(role => otherRoles.includes(role.id)).first()?.id;

      try {
        await member.roles.remove(Object.values(tiers));
        member.roles.add(tierRole);
      } catch (e) {
        logger.error(`Error while updating member ${member.id} tier : ${e}`);
      }

      updates.push({ member: member, newRole: tierRole, oldRole: oldRole });
    }
  }

  // Broadcast updates :
  if (!updates.length) return;

  const generalChannelInstance = await guild.channels.fetch(guilds.pro.channels.general);

  if (!(generalChannelInstance instanceof BaseGuildTextChannel)) return;

  let message = "";
  const consoleMessage: string[] = [];

  for (const tierRole of Object.values(tiers)) {
    const tierMembers = updates.filter(element => element.newRole === tierRole);

    if (tierMembers.length) for (const roleUpdate of tierMembers) {
      if (!roleUpdate.oldRole) {
        message += `${msgParams(tasks.tierUpdate.noOldRank, [roleUpdate.member.id, roleUpdate.newRole])}\n\n`;
        consoleMessage.push(`${userWithId(roleUpdate.member.user)} -> ${roleUpdate.newRole}`);
      } else {
        message += `${msgParams(tasks.tierUpdate.rankUpdate, [roleUpdate.member.id, roleUpdate.oldRole, roleUpdate.newRole])}\n`;
        consoleMessage.push(`${roleUpdate.oldRole} -> ${userWithId(roleUpdate.member.user)} -> ${roleUpdate.newRole}`);
      }

      message += "\n\n";
    }
  }

  generalChannelInstance.send({
    embeds: [simpleEmbed(message, "normal", tasks.tierUpdate.title)]
  });

  logger.info(`Tier role changes: ${consoleMessage.join(", ")}`);
};