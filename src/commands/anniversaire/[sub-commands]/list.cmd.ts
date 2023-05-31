import type { CommandExecute } from "#/utils/handler/command";
import { memberPerPage } from "./list.const";
import { DayJS } from "#/configs/day-js";
import { simpleEmbed } from "#/utils/discord/embed";
import { dateFormat, getAge } from "#/utils/function/date";
import { msgParams } from "#/utils/message";
import { gqlRequest } from "#/utils/request";
import { commands } from "#/configs/message/command";
import { getBirthdays } from "./list.gql";

export const execute: CommandExecute = async(command) => {
  let page = command.options.getNumber(commands.birthday.subcmds.list.options.page.name) ?? 1;
  const response = await gqlRequest(getBirthdays);

  if (!response.ok) {
    void command.reply({ embeds: [simpleEmbed(commands.birthday.exec.apiError, "error")] });
    return;
  }

  let birthdays = response.value.members.filter(member => member.birthday)
    .sort((a, b) => DayJS(a.birthday).valueOf() - DayJS(b.birthday).valueOf());

  if (!birthdays.length) {
    void command.reply({ embeds: [simpleEmbed(commands.birthday.exec.noBirthdays, "error")] });
    return;
  }

  const maxPage = Math.ceil(birthdays.length / memberPerPage);
  page = page > maxPage ? maxPage : page;
  // Slice the members with page and max page :
  birthdays = birthdays.slice(page * memberPerPage - memberPerPage, page * memberPerPage);
  let lines = "";

  for (let i = 0; i < birthdays.length; i++) {
    const member = birthdays[i];
    const birthday = DayJS(member.birthday ?? 0);
    const position = i + 1 + (page - 1) * memberPerPage;

    lines += msgParams(commands.birthday.exec.list.birthdayLine, [position, member.username, getAge(birthday), dateFormat(birthday)]);
  }

  void command.reply({
    embeds: [simpleEmbed(lines, "normal", msgParams(commands.birthday.exec.list.birthdayTitle, [page, maxPage]))]
  });
};