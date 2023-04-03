/*
  Replace "{a word}" by value passed in `params` array
*/
export const msgParams = (message: string, params: (string | number)[]): string => {
  const words = message.match(/\{[^}]+\}/g);

  if (words) for (let i = 0; i < words.length; i++) message = message.replace(words[i], String(params[i]));

  return message;
};