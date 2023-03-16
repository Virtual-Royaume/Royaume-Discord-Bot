import { Snowflake } from "discord.js";

export type GuildType = "pro" | "game";

export type Tier = {
  1: Snowflake;
  2: Snowflake;
  3: Snowflake;
  4: Snowflake;
  5: Snowflake;
}

export type Proposal = {
  upVote: ProposalSection;
  downVote: ProposalSection;
}

export type ProposalSection = {
  emoji: string;
  count: number;
}

export type Guild = {
  isPrivate: boolean;
  guildId: Snowflake;
  channels: Record<string, Snowflake>;
  roles: Record<string, Snowflake>;
  tiers: Tier;
  proposals: Record<string, Proposal>
}