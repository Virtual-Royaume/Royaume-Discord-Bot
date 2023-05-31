import type { CommandExecute } from "$core/utils/handler/command";
import { getBirthdays } from "$core/api/requests/member";
import { simpleEmbed } from "$core/utils/embed";
import { commands } from "$core/configs/message/command";
import { gqlRequest } from "$core/utils/request";
import { DayJS } from "$core/configs/day-js";
import { msgParams } from "$core/utils/message";
import { getAge } from "$core/utils/function";

export const execute: CommandExecute = async(command) => {
  const response = await gqlRequest(getBirthdays);

  if (!response.ok) {
    void command.reply({ embeds: [simpleEmbed(commands.birthday.exec.apiError, "error")] });
    return;
  }

  const birthdays = [...response.value.members.map(member => ({ ...member }))].filter(member => member.birthday).map(member => {
    member.birthday = DayJS(member.birthday).set(
      "year", DayJS().year() + (DayJS().valueOf() > DayJS(member.birthday).set("year", DayJS().year()).valueOf() ? 1 : 0)
    ).valueOf().toString();

    return member;
  });

  if (!birthdays.length) {
    void command.reply({ embeds: [simpleEmbed(commands.birthday.exec.noBirthdays, "error")] });
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
      getAge(DayJS(response.value.members.find(member => member._id === nextBirthday._id)?.birthday)) + 1
    ]
  );

  void command.reply({ embeds: [simpleEmbed(message)] });
};