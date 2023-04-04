import { removeRole } from "$core/api/requests/main-role";
import { simpleEmbed } from "$core/utils/embed";
import { msgParams } from "$core/utils/message";
import { CommandExecute } from "$core/utils/handler/command";
import { gqlRequest } from "$core/utils/request";
import { commands } from "$core/configs/message/command";
import { logger } from "$core/utils/logger";
import { userWithId } from "$core/utils/user";

export const execute: CommandExecute = async(command) => {
  const role = command.options.getRole(commands.main.groups.remove.subcmds.role.options.role.name, true);
  const removeRoleQuery = await gqlRequest(removeRole, { roleId: role.id });

  if (!removeRoleQuery.success) {
    command.reply({
      embeds: [simpleEmbed(commands.main.exec.remove.role.error, "error")],
      ephemeral: true
    });

    return;
  }

  command.reply({
    embeds: [simpleEmbed(msgParams(commands.main.exec.remove.role.succes, [role.id]))],
    ephemeral: true
  });

  logger.info(`Role ${role.id} removed by ${userWithId(command.user)}`);
};