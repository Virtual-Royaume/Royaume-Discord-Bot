import { objectKeys } from "$core/utils/function";
import { guilds } from "./guild.config";
import type { GuildType } from "./guild.type";
import type { Client, Guild, Snowflake } from "discord.js";

export const getGuild = async(client: Client, guildType: GuildType): Promise<Guild> => {
  return client.guilds.fetch(guilds[guildType].guildId);
};

export const getGuildTypeById = (id: Snowflake): GuildType | null => {
  const guild = Object.values(guilds).findIndex(value => value.guildId === id);

  if (guild === -1) return null;

  return objectKeys(guilds)[guild];
};