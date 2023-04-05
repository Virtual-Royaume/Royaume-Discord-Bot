import type { GuildMember } from "discord.js";

export type RoleUpdate = {
  member: GuildMember;
  oldRole?: string;
  newRole: string;
}