import Event, { EventName } from "$core/events/Event";
import { simpleEmbed } from "$core/utils/Embed";
import { channelLink, Collection, ThreadChannel } from "discord.js";

export default class ForumSearch extends Event {

  public name: EventName = "threadCreate";

  public async execute(thread: ThreadChannel): Promise<void> {
    const parent = thread.parent;
    const threadTitle = thread.name;

    const titles: {[key: string]: string} = {};

    const threads: Collection<string, ThreadChannel> | undefined = parent?.threads.cache;
    if (threads) {
      threads.forEach((t) => {
        if (t.id != thread.id) titles[t.name] = `${t.id} ${t.ownerId}`;
      });
    }

    const sort = this.getSimilarTitles(threadTitle, titles);
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
  }

  public getSimilarTitles(title: string, titles: {[key: string]: string}): {[key: string]: string} {
    const similarTitles: {[key: string]: string} = {};
    const titleWords = title.split(" ");

    for (const t in titles) {
      let similarWords = 0;
      for (const word of titleWords) {
        if (word.length <= 3) continue;
        if (t.includes(word)) similarWords++;
      }

      if (similarWords > 0) similarTitles[t] = titles[t];
    }

    return similarTitles;
  }

}