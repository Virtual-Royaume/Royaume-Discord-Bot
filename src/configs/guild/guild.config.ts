import { Guild, GuildType } from "./guild.type";

export const guilds: Record<GuildType, Guild> = {
  "pro": {
    isPrivate: true,
    guildId: "732251741999071303",
    channels: {
      "general": "786216771723198514"
    },
    roles: {
      waiting: "837679269098422314",
      verified: "985980071410024488"
    },
    tiers: {
      1: "985979710238523422",
      2: "985979907647623169",
      3: "985979974500614224",
      4: "985980034810519572",
      5: "985980071410024488"
    }
  },
  "game": {
    isPrivate: false,
    guildId: "1095123126746099834",
    channels: {
      "general": "1095123127278768252"
    },
    roles: {},
    tiers: {
      1: "1095751776969445526",
      2: "1095751860717113374",
      3: "1095751943156150352",
      4: "1095751947102994584",
      5: "1095751981106212945"
    }
  }
};