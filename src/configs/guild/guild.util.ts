import { guilds } from "./guild.config";
import { GuildType } from "./guild.type";
import { Client, Guild } from "discord.js";

export const getGuild = async(client: Client, guildType: GuildType): Promise<Guild> => {
  return client.guilds.fetch(guilds[guildType].guildId);
};