import { GuildMemberRoleManager, Interaction } from "discord.js";
import { simpleEmbed } from "$core/utils/Embed";
import Event, { EventName } from "$core/events/Event";
import { selectMenu } from "$resources/config/interaction-ids.json";
import { msg } from "$core/utils/Message";
import { isDevEnvironment } from "$core/utils/Environment";

export default class RolesSelector extends Event {

  public name: EventName = "interactionCreate";

  public async execute(interaction: Interaction): Promise<void> {
    if (isDevEnvironment) return;
    if (!interaction.isStringSelectMenu() || !interaction.customId.startsWith(selectMenu.rolesSelector)) return;

    // Get category :
    const category = interaction.customId.replace(`${selectMenu.rolesSelector}-`, "");

    // Get selected and un-selected roles :
    const selectedRoles = interaction.values;
    const unselectedRoles = interaction.component.options.map(option => option.value).filter(role => {
      return !selectedRoles.includes(role);
    });

    // Get member role manager :
    const memberRoles = interaction.member?.roles;

    if (!(memberRoles instanceof GuildMemberRoleManager)) {
      interaction.reply({ embeds: [simpleEmbed(msg("event-rolesselector-exec-roles-fetch-error"), "error")] });
      return;
    }

    // Add and remove selected/unselected roles :
    await memberRoles.add(selectedRoles);
    await memberRoles.remove(unselectedRoles);

    // Send confirmation :
    interaction.reply({
      embeds: [simpleEmbed(msg("event-rolesselector-exec-roles-edited", [category]))],
      ephemeral: true
    });
  }

}