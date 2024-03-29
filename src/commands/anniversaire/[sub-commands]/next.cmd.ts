import type { CommandExecute } from "#/utils/handler/command";
import { simpleEmbed } from "#/utils/discord/embed";
import { commands } from "#/configs/message/command";
import { gqlRequest } from "#/utils/request";
import { dayJS } from "#/configs/day-js";
import { msgParams } from "#/utils/message";
import { getAge } from "#/utils/function/date";
import { getBirthdays } from "./next.gql";

export const execute: CommandExecute = async(command) => {
  const response = await gqlRequest(getBirthdays);

  if (!response.ok) {
    void command.reply({ embeds: [simpleEmbed(commands.birthday.exec.apiError, "error")] });
    return;
  }

  const birthdays = [...response.value.members.map(member => ({ ...member }))].filter(member => member.birthday).map(member => {
    member.birthday = dayJS(member.birthday).set(
      "year", dayJS().year() + (dayJS().valueOf() > dayJS(member.birthday).set("year", dayJS().year()).valueOf() ? 1 : 0)
    ).valueOf().toString();

    return member;
  });

  if (!birthdays.length) {
    void command.reply({ embeds: [simpleEmbed(commands.birthday.exec.noBirthdays, "error")] });
    return;
  }

  const nextBirthday = birthdays.slice(1).reduce((pre, curr) => {
    return dayJS(curr.birthday).isBefore(dayJS(pre.birthday)) ? curr : pre;
  }, birthdays[0]);

  const message = msgParams(
    commands.birthday.exec.next.succes,
    [
      nextBirthday.username,
      dayJS(nextBirthday.birthday).format("DD/MM"),
      getAge(dayJS(response.value.members.find(member => member._id === nextBirthday._id)?.birthday)) + 1
    ]
  );

  void command.reply({ embeds: [simpleEmbed(message)] });
};