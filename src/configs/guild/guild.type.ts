import { Snowflake } from "discord.js";

export type GuildType = "pro" | "game";

export type Guild = {
  isPrivate: boolean;
  guildId: Snowflake;
  channels: Record<"general", Snowflake>;
  roles: Record<string, Snowflake>;
  tiers: Tier;
}

export type Tier = {
  1: Snowflake;
  2: Snowflake;
  3: Snowflake;
  4: Snowflake;
  5: Snowflake;
}