import { getMembersTier } from "$core/api/requests/member";
import { client } from "$core/client";
import { getGuild, guilds } from "$core/configs/guild";
import { tasks } from "$core/configs/message/task/task.config";
import { RoleUpdate } from "./tier-update-game.type";
import { simpleEmbed } from "$core/utils/embed";
import { TaskExecute, TaskInterval } from "$core/utils/handler/task";
import { logger } from "$core/utils/logger";
import { msgParams } from "$core/utils/message";
import { gqlRequest } from "$core/utils/request";
import { BaseGuildTextChannel } from "discord.js";

export const interval: TaskInterval = "0 0 0 1 * *";

export const execute: TaskExecute = async() => {
  const guild = await getGuild(client, "game");
  const tiers: Record<string, string> = guilds.game.tiers;
  const discordMembers = await guild.members.fetch();
  const apiMembersQuery = await gqlRequest(getMembersTier);

  if (!apiMembersQuery.success) return;

  const updates: RoleUpdate[] = [];

  // Check if the member have the right role :
  for (const [id, member] of discordMembers) {
    if (member.user.bot) continue;

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

      updates.push({ memberId: id, newRole: tierRole, oldRole: oldRole });
    }
  }

  // Broadcast updates :
  if (!updates.length) return;

  const generalChannelInstance = await guild.channels.fetch(guilds.game.channels.general);

  if (!(generalChannelInstance instanceof BaseGuildTextChannel)) return;

  let message = "";

  for (const tierRole of Object.values(tiers)) {
    const tierMembers = updates.filter(element => element.newRole === tierRole);

    if (tierMembers.length) {
      message += tierMembers.map(element => {
        if (!element.oldRole) return msgParams(tasks.tierUpdate.noOldRank, [element.memberId, element.newRole]);
        else return msgParams(tasks.tierUpdate.rankUpdate, [element.memberId, element.oldRole, element.newRole]);
      }).join("\n");

      message += "\n\n";
    }
  }

  generalChannelInstance.send({
    embeds: [simpleEmbed(message, "normal", tasks.tierUpdate.title)]
  });
};