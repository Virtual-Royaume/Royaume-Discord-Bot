import type { EventExecute, EventName } from "#/utils/handler/event";
import { twitterLinkRegex, extractTwitterLink } from "./twitter-link-reaction.const";

export const event: EventName = "messageCreate";

export const execute: EventExecute<"messageCreate"> = async(message) => {
  if (message.author.bot) return;
  if (!twitterLinkRegex.test(message.content)) return;

  const twitterLink = extractTwitterLink(message.content);
  if (!twitterLink) return;

  const links = Array.isArray(twitterLink) ? twitterLink : [twitterLink];
  const replacedLinks = links.map(link => link.replace(/x\.com/g, "vxtwitter.com").replace(/twitter\.com/g, "vxtwitter.com"));
  await message.reply(replacedLinks.join("\n"));
};