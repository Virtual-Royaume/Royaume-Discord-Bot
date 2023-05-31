import type { CommandExecute } from "#/utils/handler/command";
import { DayJS } from "#/configs/day-js";
import { commands } from "#/configs/message/command";
import { global } from "#/configs/global";
import { getAge } from "#/utils/function/date";
import { simpleEmbed } from "#/utils/discord/embed";
import { msgParams } from "#/utils/message";
import { gqlRequest } from "#/utils/request";
import { setBirthday } from "#/api/requests/member";
import { logger } from "#/utils/logger";
import { userWithId } from "#/utils/discord/user";

export const execute: CommandExecute = async(command) => {
  const dateString = command.options.getString(commands.birthday.subcmds.set.options.date.name, true);

  // Check if string is of type: 99/99/9999 or 9/9/9999
  if (!dateString.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/)) {
    void command.reply({
      embeds: [simpleEmbed(commands.birthday.exec.set.badFormat, "error")],
      ephemeral: true
    });
    return;
  }

  const values = dateString.split("/").map(value => Number(value));
  const date = DayJS(`${values[2]}-${values[1]}-${values[0]}Z`);

  if (!date.isValid()) {
    void command.reply({
      embeds: [simpleEmbed(commands.birthday.exec.set.invalid, "error")],
      ephemeral: true
    });
    return;
  }

  if (getAge(date) < global.minimumAge) {
    void command.reply({
      embeds: [simpleEmbed(msgParams(commands.birthday.exec.set.tooYoung, [global.minimumAge]), "error")],
      ephemeral: true
    });
    return;
  }

  const setBirthdayQuery = await gqlRequest(setBirthday, { id: command.user.id, date: date.valueOf().toString() });

  if (!setBirthdayQuery.ok) {
    void command.reply({
      embeds: [simpleEmbed(commands.birthday.exec.set.queryError, "error")],
      ephemeral: true
    });
    return;
  }

  void command.reply({
    embeds: [simpleEmbed(msgParams(commands.birthday.exec.set.success, [dateString]))],
    ephemeral: true
  });

  logger.info(`${userWithId(command.user)} has set its anniversary date: ${dateString}`);
};