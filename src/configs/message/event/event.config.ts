import { BaseMessage } from "../message.type";

export const events = {
  "rolesSelector": {
    fetchError: "Erreur lors de l'acquisition des roles.",
    succes: "Modifications de vos rôles effectuées dans la categorie **{category}**."
  },
  "roulette": {
    succes: "Parmis {choices}\n\nLe destin a choisi `{choice}`"
  },
  "guildMemberAdd": {
    welcome: "Bienvenue parmis nous <@{userId}> !",
    welcomePresentation: [
      "Le Royaume est une communauté de développeurs passionnés regroupée dans l'objectif de progresser, échanger ou même travailler ensemble. ",
      "Nous sommes ouverts à tout profile donc que tu sois débutant ou déjà sénior dans le domaine, tu trouveras ta place parmi nous !\n\n",
      "Tu peux choisir les rôles qui correspondent à ton profil via la commande `/rôle` de notre bot <@{userId}>, ceci permet de montrer aux ",
      "membres ton domaine précis dans la programmation ou encore d'être mentionné une fois de temps en temps pour un sujet ",
      "qui pourrait te plaire.\n\n",
      "Il y a aussi des rôles colorés que tu vois sur la droite, ils changent automatiquement chaque mois selon ton activité sur le serveur, ",
      "c'est un peu gadget, mais ça permet de voir d'un coup d'œil les membres les plus investi dans notre communauté.\n\n",
      "Si ce n'est pas déjà fait, je te recommande de jeter un coup d'œil au [GitHub de notre communauté](https://github.com/Virtual-Royaume), ",
      "tu trouveras dessus différents projets communs sur lesquels nos membres sont libres d'apporter leur aide."
    ].join("")
  },
  "messageCreate": {
    stepMessage: "<@{userId}> vient de passer le cap des {messageCount} messages envoyés ! 🎉"
  },
  "messageLinkReaction": {
    attachment: "🗂️ {attachmentsCount} fichiers joint(s)",
    embed: {
      content: "**Message mentionné [#{index}]({messageUrl}) dans <#{channelId}>**\n\n{content}"
    }
  }
} satisfies Record<string, BaseMessage>;