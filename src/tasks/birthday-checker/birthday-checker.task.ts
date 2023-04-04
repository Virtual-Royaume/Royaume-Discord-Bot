import { getBirthdays } from "$core/api/requests/member";
import { client } from "$core/client";
import { getGuild, guilds } from "$core/configs/guild";
import { tasks } from "$core/configs/message/task/task.config";
import DayJS from "$core/utils/day-js";
import { simpleEmbed } from "$core/utils/embed";
import { getAge } from "$core/utils/function";
import { TaskExecute, TaskInterval } from "$core/utils/handler/task";
import { logger } from "$core/utils/logger";
import { msgParams } from "$core/utils/message";
import { gqlRequest } from "$core/utils/request";
import { BaseGuildTextChannel } from "discord.js";

export const interval: TaskInterval = "0 0 0 * * *";

export const execute: TaskExecute = async() => {
  // Check birthdays of the day :
  const birthdaysQuery = await gqlRequest(getBirthdays);

  if (!birthdaysQuery.success) return;

  const currentDate = DayJS().tz();
  const birthdays = birthdaysQuery.data.members.filter(member => {
    if (!member.birthday) return false;

    const birthday = DayJS(member.birthday).tz();

    return birthday.date() === currentDate.date()
    && birthday.month() === currentDate.month();
  });

  // Send birthday message :
  if (birthdays.length === 0) return;

  const generalChannelInstance = await (await getGuild(client, "pro")).channels.fetch(guilds.pro.channels.general);

  if (!(generalChannelInstance instanceof BaseGuildTextChannel)) return;

  const messages = Object.values(tasks.birthdayChecker.messages);

  for (const member of birthdays) {
    if (!member.birthday) continue;

    const message = messages[Math.floor(Math.random() * messages.length)];
    const birthday = DayJS(member.birthday).tz();

    const embed = simpleEmbed(msgParams(message.text, [member._id]), "normal", message.title)
      .setThumbnail(member.profilePicture)
      .setFooter({ text: msgParams(tasks.birthdayChecker.footer, [getAge(birthday)]) });

    logger.info(`Sending birthday message to ${member._id} (${member.username})`);
    generalChannelInstance.send({ embeds: [embed] });
  }
};