import { Guild, GuildType } from "./guild.type";

export const guilds: Record<GuildType, Guild> = {
  "pro": {
    isPrivate: true,
    guildId: "732251741999071303",
    channels: {
      "general": "786216771723198514",
      "voiceCategory": "853314658789490709"
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
    guildId: "1083297057139335220",
    channels: {
      "general": "1083297057902694452"
    },
    roles: {},
    tiers: {
      1: "1083407995616116796",
      2: "1083408283051765810",
      3: "1083408004638068746",
      4: "1083408006055739443",
      5: "1083408485489844265"
    }
  }
};