import type { EventExecute, EventName } from "#/utils/handler/event";
import { interactionId } from "#/configs/global";
import { guilds } from "#/configs/guild";
import { events } from "#/configs/message/event";
import { simpleEmbed } from "#/utils/discord/embed";
import { logger } from "#/utils/logger";
import { msgParams } from "#/utils/message";
import { GuildMemberRoleManager } from "discord.js";

export const event: EventName = "interactionCreate";

export const execute: EventExecute<"interactionCreate"> = async(interaction) => {
  if (interaction.guildId !== guilds.pro.guildId) return;
  if (!interaction.isStringSelectMenu() || !interaction.customId.startsWith(interactionId.selectMenu.rolesSelector)) return;

  // Get category :
  const category = interaction.customId.replace(`${interactionId.selectMenu.rolesSelector}-`, "");

  // Get selected and un-selected roles :
  const selectedRoles = interaction.values;
  const unselectedRoles = interaction.component.options.map(option => option.value).filter(role => {
    return !selectedRoles.includes(role);
  });

  // Get member role manager :
  const memberRoles = interaction.member?.roles;

  if (!(memberRoles instanceof GuildMemberRoleManager)) {
    void interaction.reply({ embeds: [simpleEmbed(events.rolesSelector.fetchError, "error")] });
    return;
  }

  // Add and remove selected/unselected roles :
  try {
    await memberRoles.add(selectedRoles);
    await memberRoles.remove(unselectedRoles);

    let msg = `Member ${interaction.member?.user.username || "unknow username"} roles updated :`;
    if (selectedRoles.length > 0) msg += ` ${selectedRoles.length} added`;
    if (unselectedRoles.length > 0) msg += ` ${unselectedRoles.length} removed`;

    logger.info(msg);
  } catch (e) {
    logger.error(`Error while updating member ${interaction.member?.user.id || "unknow ID"} roles : ${String(e)}`);
  }

  // Send confirmation :
  void interaction.reply({
    embeds: [simpleEmbed(msgParams(events.rolesSelector.succes, [category]))],
    ephemeral: true
  });
};