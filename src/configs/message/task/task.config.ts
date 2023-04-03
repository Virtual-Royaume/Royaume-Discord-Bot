import { BaseMessage } from "../message.type";

export const tasks = {
  birthdayChecker: {
    footer: "{userYearsOld} années de vie sur terre",
    messages: {
      0: {
        title: "SURPRISE !!",
        text: "Aujourd'hui est un jour spécial pour <@{userId}> !!!!"
      },
      1: {
        title: "QUOI ???",
        text: "Feur ! C'est l'anniversaire de <@{userId}>."
      },
      2: {
        title: "WOWWW",
        text: "Bon anniversaire <@{userId}> !! 🎁🎉"
      }
    }
  },
  tierUpdate: {
    noOldRank: "<@{userId}> ➜ <@&{newRoleId}>",
    rankUpdate: "<@{userId}> <@&{oldRoleId}> ➜ <@&{newRoleId}>",
    title: "Changement des rôles d'activités"
  }
} satisfies Record<string, BaseMessage>;