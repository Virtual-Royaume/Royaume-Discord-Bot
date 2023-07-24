import type { EventExecute, EventName } from "#/utils/handler/event";
import type { ForumChannel, GuildTextBasedChannel, TextBasedChannel } from "discord.js";
import { guilds } from "#/configs/guild";
import { ChannelType } from "discord.js";
import { chatWithAI } from "#/utils/openai/openai";

export const event: EventName = "messageCreate";

export const enableInDev = true;

export const PROMPT_CREATE_THREAD = [
  "Tu est un expert en génération de titre, tu génère un titre par rapport aux messages qu'on te donne, et tu répond SEULEMENT",
  "avec le titre. Tu n'envoi pas de message, tu envoi juste le titre, tu ajoute aussi un émoji au début qui est en rapport",
  "avec le contexte du message envoyé. Le titre ne doit pas  dépasser 100 caractères (1 caractère = 1 lettre, 1 chiffre",
  ", 1 espace, 1 ponctuation, 1 symbole, 1 emoji)."
].join(" ");

export const execute: EventExecute<"messageCreate"> = async(message) => {
  if (message.guild?.id !== guilds.pro.guildId) return;
  if (message.author.bot) return;

  const channel: GuildTextBasedChannel | TextBasedChannel | ForumChannel = message.channel;

  if (channel.type === ChannelType.PublicThread && channel.parent) return;

  if (channel.id !== "786216771723198514") return;

  const title = await chatWithAI(message.content, PROMPT_CREATE_THREAD);

  await message.startThread({
    name: title,
    reason: "Création automatique d'un thread"
  }).then(thread => thread.leave());
};