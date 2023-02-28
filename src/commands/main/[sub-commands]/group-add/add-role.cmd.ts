import { addRole } from "$core/api/requests/main-role";
import { simpleEmbed } from "$core/utils/embed";
import { msg } from "$core/utils/message";
import { CommandExecute } from "$core/utils/handler/command";
import { gqlRequest } from "$core/utils/request";

export const execute: CommandExecute = async(command) => {
  const role = command.options.getRole(msg("cmd-main-builder-group-add-role-role-name"), true);
  const category = command.options.getString(msg("cmd-main-builder-group-add-channel-category-name"), true);
  const addRoleQuery = await gqlRequest(addRole, { roleId: role.id, category: category });

  if (!addRoleQuery.success) {
    command.reply({
      embeds: [simpleEmbed(msg("cmd-main-exec-add-role-error"), "error")],
      ephemeral: true
    });

    return;
  }

  command.reply({
    embeds: [simpleEmbed(msg("cmd-main-exec-add-role-succes", [role.id, category]))],
    ephemeral: true
  });
};