import DayJS from "$core/utils/day-js";
import { CommandExecute } from "$core/utils/handler/command";
import { commands } from "$core/configs/message/command";
import { global } from "$core/configs/global.config";
import { getAge } from "$core/utils/function";
import { simpleEmbed } from "$core/utils/embed";
import { msgParams } from "$core/utils/message";
import { gqlRequest } from "$core/utils/request";
import { setBirthday } from "$core/api/requests/member";
import { logger } from "$core/utils/logger";

export const execute: CommandExecute = async(command) => {
  const dateString = command.options.getString(commands.birthday.subcmds.set.options.date.name, true);

  // Check if string is of type: 99/99/9999 or 9/9/9999
  if (!dateString.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/)) {
    command.reply({
      embeds: [simpleEmbed(commands.birthday.exec.set.badFormat, "error")],
      ephemeral: true
    });
    return;
  }

  const values = dateString.split("/").map(value => Number(value));
  const date = DayJS(`${values[2]}-${values[1]}-${values[0]}Z`);

  if (!date.isValid()) {
    command.reply({
      embeds: [simpleEmbed(commands.birthday.exec.set.invalid, "error")],
      ephemeral: true
    });
    return;
  }

  if (getAge(date) < global.minimumAge) {
    command.reply({
      embeds: [simpleEmbed(msgParams(commands.birthday.exec.set.tooYoung, [global.minimumAge]), "error")],
      ephemeral: true
    });
    return;
  }

  const setBirthdayQuery = await gqlRequest(setBirthday, { id: command.user.id, date });

  if (!setBirthdayQuery.success) {
    command.reply({
      embeds: [simpleEmbed(commands.birthday.exec.set.queryError, "error")],
      ephemeral: true
    });
    return;
  }

  command.reply({
    embeds: [simpleEmbed(msgParams(commands.birthday.exec.set.success, [dateString]))],
    ephemeral: true
  });

  logger.info(`${command.user.username} (${command.user.id}) has set its anniversary date: ${dateString}`);
};