import type { CommandExecute } from "#/utils/handler/command";
import { simpleEmbed } from "#/utils/discord/embed";
import { msgParams } from "#/utils/message";
import { gqlRequest } from "#/utils/request";
import { commands } from "#/configs/message/command";
import { logger } from "#/utils/logger";
import { userWithId } from "#/utils/discord/user";
import { removeRole } from "./remove-role.gql";

export const execute: CommandExecute = async(command) => {
  const role = command.options.getRole(commands.main.groups.remove.subcmds.role.options.role.name, true);
  const removeRoleQuery = await gqlRequest(removeRole, { roleId: role.id });

  if (!removeRoleQuery.ok) {
    void command.reply({
      embeds: [simpleEmbed(commands.main.exec.remove.role.error, "error")],
      ephemeral: true
    });

    return;
  }

  void command.reply({
    embeds: [simpleEmbed(msgParams(commands.main.exec.remove.role.succes, [role.id]))],
    ephemeral: true
  });

  logger.info(`Role ${role.id} removed by ${userWithId(command.user)}`);
};