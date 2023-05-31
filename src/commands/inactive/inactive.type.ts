import type { Tier } from "#/configs/guild/guild.type";
import type { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Snowflake } from "discord.js";

export type Page = {
  maxPage: number;
  page: number;
  data: PageData;
}

export type PageData = {
  previousMember?: string;
  nextMember?: string;
  memberId: Snowflake;
  username: string;
  messages: number;
  minutes: number;
  tier: keyof Tier;
  createAt: Date;
  joinServerAt: Date | null;
  avatar: string | null;
  banner: string | null;
};

export type formatedPage = {
  embed: EmbedBuilder;
  components: ActionRowBuilder<ButtonBuilder>;
}