export const msgParams = (message: string, params: (string | number)[]): string => {
  const words = message.match(/{[^}]+}/g);

  if (words) for (let i = 0; i < params.length; i++) {
    message = message.replace(words[i], String(params[i]));
  }

  return message;
};

export const containsDiscordLink = (content: string): boolean => {
  const discordLinkRegex = /http(s?):\/\/(www\.|canary\.|ptb\.)?discord.com\/channels(\/\d*){3}$/gi;
  return discordLinkRegex.test(content);
};

export const extractDiscordLink = (content: string): string | string[] | null => {
  const discordLinkRegex = /http(s?):\/\/(www\.|canary\.|ptb\.)?discord.com\/channels(\/\d*){3}/gi;
  const discordLinks = content.match(discordLinkRegex);

  if (discordLinks) return discordLinks;
  return null;
};