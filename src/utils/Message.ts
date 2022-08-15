import messages from "../../resources/config/messages.json";

export function message(key: string, params: any[]): string {
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