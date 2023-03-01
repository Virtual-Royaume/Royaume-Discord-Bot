import { GuildPremiumTier } from "discord.js";

export const maxEmojiByGuildTier: Record<GuildPremiumTier, number> = {
  "0": 50,
  "1": 100,
  "2": 150,
  "3": 250
};

export enum StopReason {
  MESSAGE_DELETED = "messageDelete",
  TIME = "time",
  ACCEPTED = "accepted",
  REFUSED = "refused",
}