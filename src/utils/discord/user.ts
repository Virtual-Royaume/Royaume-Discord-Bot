import type { User } from "discord.js";

/**
 * For displaying in logs.
 * @returns username#2000 (ID)
 */
export const userWithId = (user: User): string => {
  return `${user.tag} (${user.id})`;
};