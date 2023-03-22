import { guilds } from "$core/configs/guild";
import { Titles } from "$core/events/forum-search/forum-search.type";
import { simpleEmbed } from "$core/utils/embed";
import { EventExecute, EventName } from "$core/utils/handler/event";
import { ForumChannel, channelLink } from "discord.js";

export const event: EventName = "threadCreate";

export const execute: EventExecute<"threadCreate"> = async(thread) => {
  if (thread.guildId !== guilds.pro.guildId) return;

  const parent = thread.parent;

  if (!(parent instanceof ForumChannel)) return;

  const titles: Titles = {};

  for (const forumThread of parent.threads.cache.values()) {
    if (thread.id === forumThread.id) continue;

    titles[forumThread.name] = `${thread.id} ${thread.ownerId}`;
  }

  const sort = this.getSimilarTitles(thread.name, titles);
  let message = ":wave: Voici quelques posts qui ont des ressemblances avec le titre de celui-ci:\n";

  let i = 0;
  Object.keys(sort).forEach((key) => {
    const value = sort[key];
    const thread = parent?.threads.cache.get(value.split(" ")[0]);

    if (thread) {
      message += `• [${thread?.name}](${channelLink(thread?.id)}) par <@${value.split(" ")[1]}>\n`;
      i++;
    }
  });

  if (i !== 0) thread.send({ embeds: [simpleEmbed(message, "normal", "Recherche de posts similaires")] });
};