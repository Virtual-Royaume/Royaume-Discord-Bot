import { addRole } from "$core/api/requests/main-role";
import { simpleEmbed } from "$core/utils/embed";
import { commands } from "$core/configs/message/command";
import { CommandExecute } from "$core/utils/handler/command";
import { gqlRequest } from "$core/utils/request";
import { msgParams } from "$core/utils/message";
import { logger } from "$core/utils/logger";
import { userWithId } from "$core/utils/user";

export const execute: CommandExecute = async(command) => {
  const role = command.options.getRole(commands.main.groups.add.subcmds.role.options.role.name, true);
  const category = command.options.getString(commands.main.groups.add.subcmds.role.options.category.name, true);
  const addRoleQuery = await gqlRequest(addRole, { roleId: role.id, category: category });

  if (!addRoleQuery.success) {
    command.reply({
      embeds: [simpleEmbed(commands.main.exec.add.role.error, "error")],
      ephemeral: true
    });

    return;
  }

  command.reply({
    embeds: [simpleEmbed(msgParams(commands.main.exec.add.role.succes, [role.id, category]))],
    ephemeral: true
  });

  logger.info(`Role ${role.id} added to category ${category} by ${userWithId(command.user)}`);
};