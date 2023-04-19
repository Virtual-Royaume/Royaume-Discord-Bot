import { getRolesByCategory } from "$core/api/func/main-role";
import { interactionId } from "$core/configs";
import type { Guild, GuildMember, SelectMenuComponentOptionData } from "discord.js";
import { ActionRowBuilder, StringSelectMenuBuilder } from "discord.js";

export const generateActionRow = async(member: GuildMember, guild: Guild): Promise<ActionRowBuilder<StringSelectMenuBuilder>[]> => {
  const messageActionRows: ActionRowBuilder<StringSelectMenuBuilder>[] = [];

  for (const [category, rolesId] of Object.entries(await getRolesByCategory())) {
    const options: SelectMenuComponentOptionData[] = [];

    for (const roleId of rolesId) {
      const role = await guild.roles.fetch(roleId);

      if (!role) continue;

      const memberRoles = member.roles;

      options.push({
        label: role.name,
        value: roleId,
        default: memberRoles.cache.has(roleId)
      });
    }

    if (!options.length) continue;

    messageActionRows.push(
      new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId(`${interactionId.selectMenu.rolesSelector}-${category}`)
          .setMinValues(0)
          .setMaxValues(options.length)
          .setPlaceholder(category)
          .setOptions(options)
      )
    );
  }

  return messageActionRows;
};