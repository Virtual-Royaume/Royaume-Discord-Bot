import { Snowflake } from "discord.js";

export type GuildType = "pro" | "game";

export type Tier = {
  1: Snowflake;
  2: Snowflake;
  3: Snowflake;
  4: Snowflake;
  5: Snowflake;
}

export type Guild = {
  isPrivate: boolean;
  guildId: Snowflake;
  channels: Record<string, Snowflake>;
  roles: Record<string, Snowflake>;
  tiers: Tier;
}