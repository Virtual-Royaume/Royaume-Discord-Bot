import { discordLinkRegex } from "./message.type";

export const msgParams = (message: string, params: (string | number)[]): string => {
  const words = message.match(/{[^}]+}/g);

  if (words) for (let i = 0; i < params.length; i++) {
    message = message.replace(words[i], String(params[i]));
  }

  return message;
};

export const containsDiscordLink = (content: string): boolean => {
  return content.match(discordLinkRegex) !== null;
};

export const extractDiscordLink = (content: string): string | string[] | null => {
  const discordLinks = content.match(discordLinkRegex);
  if (discordLinks) return discordLinks;
  return null;
};