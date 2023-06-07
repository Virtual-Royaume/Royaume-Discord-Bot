export const msgParams = (message: string, params: (string | number)[]): string => {
  const words = message.match(/\{[^}]+\}/g);

  if (words) for (let i = 0; i < params.length; i++) {
    message = message.replace(words[i], String(params[i]));
  }

  return message;
};

export const isDiscordLink = (link: string): boolean => {
  return link.match(/^http(s?):\/\/(www\.|canary\.|ptb\.)?discord.com\/channels(\/\d*){3}$/gi) !== null;
};