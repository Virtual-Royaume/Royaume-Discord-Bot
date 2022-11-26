import messages from "$resources/config/messages.json";

/*
    Format du fichier JSON :
    SlashCommandBuilder: "command-{Nom de la commande}-builder-{variable}"
    Execute: "command-{Nom de la commande}-exec-{variable}"
    Exemple: "command-together-builder-name": "watch-together"
    Exemple: "command-together-exec-voice-needed": "Vous devez êtr[...]"
*/

export function msg(key: string, params: (string | number)[] = []): string {
  const messageList: Record<string, string | string[]> = messages;
  let message = messageList[key];

  if (!message) return "Aucun message trouvé (" + key + ")";

  if (Array.isArray(message)) message = message.join("\n");

  const words = message.match(/\{[^}]+\}/g);

  if (words) for (let i = 0; i < words.length; i++) message = message.replace(words[i], String(params[i]));

  return message;
}