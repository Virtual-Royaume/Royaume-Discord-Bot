import type { Collection, Guild, GuildMember } from "discord.js";

export const getGuildMembers = async(guild: Guild): Promise<Collection<string, GuildMember> | null> => {
  try {
    const members = await guild.members.fetch({ time: 5000 });

    if (members) return members;
    return null;
  } catch {
    return null;
  }
};