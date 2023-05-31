import type { HexColorString } from "discord.js";

export type GlobalColor = "primary" | "error";

export type GlobalConfig = {
  localFormat: string;
  minimumAge: number;
  colors: Record<GlobalColor, HexColorString>;
}

export type ProposalType = "verify" | "emoji";

export type Proposal = {
  upVote: ProposalSection;
  downVote: ProposalSection;
}

export type ProposalSection = {
  emoji: string;
  count: number;
}