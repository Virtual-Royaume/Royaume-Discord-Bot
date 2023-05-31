import type { Guild, GuildMember, SelectMenuComponentOptionData } from "discord.js";
import type { Result } from "rustic-error";
import { ok } from "rustic-error";
import { error } from "rustic-error";
import { interactionId } from "#/configs/global";
import { ActionRowBuilder, StringSelectMenuBuilder } from "discord.js";
import { getRolesByCategory } from "#/utils/api/role";

export const generateActionRow = async(member: GuildMember, guild: Guild): Promise<Result<ActionRowBuilder<StringSelectMenuBuilder>[], Error>> => {
  const messageActionRows: ActionRowBuilder<StringSelectMenuBuilder>[] = [];

  const roles = await getRolesByCategory();

  if (!roles.ok) return error(Error("Unable to fetch roles from API"));

  for (const [category, rolesId] of Object.entries(roles.value)) {
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

  return ok(messageActionRows);
};