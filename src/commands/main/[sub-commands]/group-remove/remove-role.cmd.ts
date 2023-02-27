import { removeRole } from "$core/api/requests/MainRole";
import { simpleEmbed } from "$core/utils/Embed";
import { msg } from "$core/utils/Message";
import { CommandExecute } from "$core/utils/handler/command";
import { gqlRequest } from "$core/utils/request";

export const execute: CommandExecute = async(command) => {
  const role = command.options.getRole(msg("cmd-main-builder-group-remove-role-role-name"), true);
  const removeRoleQuery = await gqlRequest(removeRole, { roleId: role.id });

  if (!removeRoleQuery.success) {
    command.reply({
      embeds: [simpleEmbed(msg("cmd-main-exec-remove-role-error"), "error")],
      ephemeral: true
    });

    return;
  }

  command.reply({
    embeds: [simpleEmbed(msg("cmd-main-exec-remove-role-succes", [role.id]))],
    ephemeral: true
  });
};