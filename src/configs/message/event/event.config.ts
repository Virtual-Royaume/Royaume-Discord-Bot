import { BaseMessage } from "../message.type";

export const events = {
  "rolesSelector": {
    fetchError: "Erreur lors de l'acquisition des roles.",
    succes: "Modifications de vos rôles effectuées dans la categorie **{category}**."
  },
  "roulette": {
    succes: "Parmis {choices}\n\nLe destin a choisi `{choice}`"
  }
} satisfies Record<string, BaseMessage>;