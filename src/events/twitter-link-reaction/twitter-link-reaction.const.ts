export const twitterLinkRegex = /https?:\/\/(?:twitter\.com|x\.com)\/(?:#!\/)?(\w+)\/status?\/(\d+)/g;

export const extractTwitterLink = (text: string): string | string[] | null => {
  if (!twitterLinkRegex.test(text)) return null;
  return text.match(twitterLinkRegex);
};