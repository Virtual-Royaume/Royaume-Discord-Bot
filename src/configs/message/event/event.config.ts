import { BaseMessage } from "../message.type";

export const events = {
  "rolesSelector": {
    fetchError: "Erreur lors de l'acquisition des roles.",
    succes: "Modifications de vos rôles effectuées dans la categorie **{category}**."
  }
} satisfies Record<string, BaseMessage>;