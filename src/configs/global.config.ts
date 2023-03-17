import { Proposal } from "./global.type";

export const global = {
  localFormat: "fr-FR",
  minimumAge: 14,
  colors: {
    primary: "#5339DD",
    error: "#FF5555"
  }
};

export const interactionId = {
  selectMenu: {
    rolesSelector: "sm0"
  },
  button: {
    verify: "b0",
    inactive: {
      inactiveFirst: "b1",
      inactivePrevious: "b2",
      inactiveKick: "b3",
      inactiveNext: "b4",
      inactiveLast: "b5"
    }
  },
  modal: {
    verify: "m0",
    roulette: "m1"
  }
};

export const proposals: Record<string, Proposal> = {
  verify: {
    upVote: {
      emoji: "👍",
      count: 5
    },
    downVote: {
      emoji: "👎",
      count: 7
    }
  },
  emoji: {
    upVote: {
      emoji: "👍",
      count: 5
    },
    downVote: {
      emoji: "👎",
      count: 6
    }
  }
};