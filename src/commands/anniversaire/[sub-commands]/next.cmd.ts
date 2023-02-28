import { getBirthdays } from "$core/api/requests/member";
import { simpleEmbed } from "$core/utils/embed";
import { CommandExecute } from "$core/utils/handler/command";
import { commands } from "$resources/config/messages.json";
import { gqlRequest } from "$core/utils/request";
import DayJS from "$core/utils/day-js";
import { msgParams } from "$core/utils/message";
import { getAge } from "$core/utils/function";

export const execute: CommandExecute = async(command) => {
  const response = await gqlRequest(getBirthdays);

  if (!response.success) {
    command.reply({ embeds: [simpleEmbed(commands.birthday.exec.apiError, "error")] });
    return;
  }

  const birthdays = [...response.data.members.map(member => ({ ...member }))].filter(member => member.birthday).map(member => {
    member.birthday = DayJS(member.birthday).set(
      "year", DayJS().year() + (DayJS().valueOf() > DayJS(member.birthday).set("year", DayJS().year()).valueOf() ? 1 : 0)
    ).valueOf();

    return member;
  });

  if (!birthdays.length) {
    command.reply({ embeds: [simpleEmbed(commands.birthday.exec.noBirthdays, "error")] });
    return;
  }

  const nextBirthday = birthdays.slice(1).reduce((pre, curr) => {
    return DayJS(curr.birthday).isBefore(DayJS(pre.birthday)) ? curr : pre;
  }, birthdays[0]);

  const message = msgParams(
    commands.birthday.exec.next.succes,
    [
      nextBirthday.username,
      DayJS(nextBirthday.birthday).format("DD/MM"),
      getAge(DayJS(response.data.members.find(member => member._id === nextBirthday._id)?.birthday)) + 1
    ]
  );

  command.reply({ embeds: [simpleEmbed(message)] });
};