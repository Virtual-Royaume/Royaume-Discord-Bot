import messages from "../../resources/config/messages.json";

export function message(key: string, params: any[]): string {
    const messageList: Record<string, string> = <Record<string, string>>messages;
    const message = messageList[key];

    // On vérifie si la clé "key" existe dans "messages.json"
    if (!message) return "Aucun message trouvé (" + key + ")";

    // Les paramètres sont par positions donc "Bonjour {member} tu a {age}"
    // => params[0] = member, params[1] = age
    return message.replace(/\{(\d+)\}/g, (match, index) => params[index]);
}