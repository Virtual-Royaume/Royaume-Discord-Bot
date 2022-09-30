import messages from "$resources/config/messages.json";

/// Format du fichier JSON :
// SlashCommandBuilder: "command-{Nom de la commande}-builder-{variable}"
// Execute: "command-{Nom de la commande}-exec-{variable}"

// Exemple: "command-together-builder-name": "watch-together"
// Exemple: "command-together-exec-voice-needed": "Vous devez êtr[...]"
export function msg(key: string, params: any[] = []): string {
    const messageList: Record<string, string> = <Record<string, string>>messages;
    let message = messageList[key];
    if (!message) return "Aucun message trouvé (" + key + ")";

    const words = message.match(/\{[^}]+\}/g);
    if (words) {
        for (let i = 0; i < words.length; i++) {
            message = message.replace(words[i], params[i]);
        }
    }
    return message;
}