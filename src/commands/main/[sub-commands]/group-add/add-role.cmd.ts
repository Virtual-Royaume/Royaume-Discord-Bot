import type { CommandExecute } from "#/utils/handler/command";
import { simpleEmbed } from "#/utils/discord/embed";
import { commands } from "#/configs/message/command";
import { gqlRequest } from "#/utils/request";
import { msgParams } from "#/utils/message";
import { logger } from "#/utils/logger";
import { userWithId } from "#/utils/discord/user";
import { addRole } from "./add-role.gql";

export const execute: CommandExecute = async(command) => {
  const role = command.options.getRole(commands.main.groups.add.subcmds.role.options.role.name, true);
  const category = command.options.getString(commands.main.groups.add.subcmds.role.options.category.name, true);
  const addRoleQuery = await gqlRequest(addRole, { roleId: role.id, category: category });

  if (!addRoleQuery.ok) {
    void command.reply({
      embeds: [simpleEmbed(commands.main.exec.add.role.error, "error")],
      ephemeral: true
    });

    return;
  }

  void command.reply({
    embeds: [simpleEmbed(msgParams(commands.main.exec.add.role.succes, [role.id, category]))],
    ephemeral: true
  });

  logger.info(`Role ${role.id} added to category ${category} by ${userWithId(command.user)}`);
};