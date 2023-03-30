import { interactionId } from "$core/configs";
import { guilds } from "$core/configs/guild";
import { events } from "$core/configs/message/event";
import { simpleEmbed } from "$core/utils/embed";
import { EventExecute, EventName } from "$core/utils/handler/event";
import { logger } from "$core/utils/logger";
import { msgParams } from "$core/utils/message";
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
    interaction.reply({ embeds: [simpleEmbed(events.rolesSelector.fetchError, "error")] });
    return;
  }

  // Add and remove selected/unselected roles :
  try {
    await memberRoles.add(selectedRoles);
    await memberRoles.remove(unselectedRoles);
  } catch (e) {
    logger.error(`Error while updating member ${interaction.member?.user.id} roles : ${e}`);
  }

  // Send confirmation :
  interaction.reply({
    embeds: [simpleEmbed(msgParams(events.rolesSelector.succes, [category]))],
    ephemeral: true
  });
};