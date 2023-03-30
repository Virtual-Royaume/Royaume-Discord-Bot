import { getBirthdays } from "$core/api/requests/member";
import { memberPerPage } from "./list.const";
import DayJS from "$core/utils/day-js";
import { simpleEmbed } from "$core/utils/embed";
import { dateFormat, getAge } from "$core/utils/function";
import { CommandExecute } from "$core/utils/handler/command";
import { msgParams } from "$core/utils/message";
import { gqlRequest } from "$core/utils/request";
import { commands } from "$core/configs/message/command";

export const execute: CommandExecute = async(command) => {
  let page = command.options.getNumber(commands.birthday.subcmds.list.options.page.name) ?? 1;
  const response = await gqlRequest(getBirthdays);

  if (!response.success) {
    command.reply({ embeds: [simpleEmbed(commands.birthday.exec.apiError, "error")] });
    return;
  }

  let birthdays = response.data.members.filter(member => member.birthday)
    .sort((a, b) => a.birthday - b.birthday);

  if (!birthdays.length) {
    command.reply({ embeds: [simpleEmbed(commands.birthday.exec.noBirthdays, "error")] });
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

  command.reply({
    embeds: [simpleEmbed(lines, "normal", msgParams(commands.birthday.exec.list.birthdayTitle, [page, maxPage]))]
  });
};