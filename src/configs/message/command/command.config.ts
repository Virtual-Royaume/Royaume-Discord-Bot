import { Command } from "$core/configs/message/command/command.type";

export const commands = {
  birthday: {
    name: "anniversaire",
    description: "Définir et afficher les anniversaires",
    exec: {
      apiError: "Erreur lors de la récupération des dates d'anniversaires",
      list: {
        birthdayLine: "**{position}. {username} :** {age} ans ({date})\n",
        birthdayTitle: "Anniversaires des membres (page {page}/{maxPage})"
      },
      next: {
        succes: "Le prochain anniversaire est celui de **{username}** le **{date}**, il aura **{age}** ans ! 🎉"
      },
      noBirthdays: "Il n'y a aucun anniversaire enregistré",
      set: {
        badFormat: "Le format de votre date est invalide.",
        invalid: "Cette date est invalide.",
        success: "Votre date d'anniversaire a bien été enregistrée ! *(`{date}`)*",
        tooYoung: "L'age minimum requis est de {minimumAge} ans."
      }
    },
    subcmds: {
      list: {
        description: "Afficher la liste des anniversaires",
        name: "list",
        options: {
          page: {
            description: "Numéro de la page à afficher",
            name: "page"
          }
        }
      },
      next: {
        description: "Afficher le prochain anniversaire",
        name: "next"
      },
      set: {
        description: "Définir votre anniversaire",
        name: "set",
        options: {
          date: {
            description: "format : DD/MM/YYYY (jour/mois/année de naissance)",
            name: "date"
          }
        }
      }
    }
  },
  clean: {
    description: "Supprimer plusieurs messages en même temps",
    exec: {
      needTextChannel: "Vous devez utiliser cette commande dans un salon textuel",
      succes: "Vous avez supprimé {number} messages !"
    },
    name: "clean",
    options: {
      count: {
        description: "Nombre de messages a supprimer",
        name: "count"
      }
    }
  },
  interaction: {
    name: "interaction",
    description: "Envoi une interaction dans un salon",
    subcmds: {
      verif: {
        name: "verif",
        description: "Message de forumaire pour les nouveaux membres"
      }
    },
    exec: {
      verif: {
        notGuildText: "Cette commande doit être éxecuté dans un salon textuel de serveur",
        embed: {
          title: "Vérification pour entrer dans le Royaume",
          content: [
            "Bienvenue, tu es dans le salon de vérification des nouveaux membres.\n",
            "**Le Royaume** est un serveur privé où la bonne ambiance est donc obligatoire. Ici on parle principalement de **programmation**",
            " et d'autres choses encore.\n\n",
            "Si les domaines cités ci-dessus te correspondent et que tu as envie de faire parti de cette communauté privée et d'évoluer avec nous",
            ", il faudra que tu fasses une petite présentation de toi, tes ambitions, tes projets, tes centres d'intérêt... Donne nous envie quoi !"
          ].join("")
        },
        button: {
          label: "Faire sa présentation",
          emoji: "📝"
        },
        succes: "Votre interaction a bien était créé."
      }
    }
  },
  emoji: {
    description: "Ajouter un nouvel emoji au serveur",
    exec: {
      isntInGuild: "Cette commande doit être éxecuté sur un serveur",
      isntInOfficialGuild: "Cette commande doit être éxecuté sur un des serveurs du Royaume",
      emojiAlreadyExist: "`{emojiId}` existe deja... Choisissez un autre nom !",
      emojiLimit: [
        "Le nombre maximum d'emoji sur le serveur a été atteint.",
        " Supprimez des emojis ou boostez le serveur pour pouvoir en ajouter un nouveau !"
      ].join(""),
      generalChannelDoesntExist: "Le salon général n'a pas été trouvé...",
      generalChannelIsntText: "Le salon général n'est pas un salon textuel...",
      pollAccepted: "Proposition acceptée !",
      pollEmbed: {
        content: [
          "Proposition d'un nouveau émoji sur le serveur :",
          "\"`{emojiIdentifier}`\"\n",
          "Proposé par <@{userId}>"
        ].join("\n"),
        title: "Proposition d'émoji"
      },
      pollRefused: "Proposition rejetée.",
      pollSent: "Votre proposition pour un nouvel émoji a bien été envoyée dans le salon <#{generalChannelId}>.",
      pollTimeout: "Le temps de vote pour cette proposition est écoulé."
    },
    name: "emoji",
    options: {
      emoji: {
        description: "Emoji que tu souhaites ajouter",
        name: "emoji"
      },
      name: {
        description: "Nom de l'emoji",
        name: "name"
      }
    }
  },
  forum: {
    description: "Commande relative aux salons forums",
    exec: {
      channelNotPost: "Veuillez éffectuer cette commande dans un post.",
      rename: {
        error: "Erreur lors du renommage de ce post.",
        succes: "Post renommé en **{name}**."
      },
      resolve: {
        badLocation: "Le message de réponse doit provenir de ce post",
        isntDiscordMessageLink: "Veuillez saisir un vers un message discord valide",
        succes: "Ce [message]({url}) a été défini comme réponse",
        unknownMessage: "Le message n'éxiste pas...",
        unpinnableMessage: "Le message n'éxiste pas..."
      },
      why: {
        message: [
          "• Y ajouter un titre correct permet de vérifier rapidement si votre problème est déjà résolu ou non.\n\n",
          "• Les salons forum sont là pour vous permettre de poser des questions et de trouver des réponses.\n\n",
          "• Cela permet de garder un maximum de clarté car vous ne vous mélanger pas avec la discussion générale.\n\n",
          "• Garder une trace des questions et des réponses, il est plus facile pour les membres de retrouver la réponse dont ils pourraient avoir",
          " besoin dans les salons forums.\n\n",
          "• Il est plus motivant pour la personne qui vous aide à pouvoir le faire de manière isolée avec une trace dans le temps plus forte.\n\n",
          "• Que votre question soit très simple ou complexe les forums seront mieux, une aide sur plusieurs jours dans un salon isolé permet ",
          "un meilleur suivi et les meilleures questions du célèbre forum d'aide Stack overflow sont les plus simples.\n\n",
          "• Avant de créer votre propre post avec une question similaire ou identique",
          ", pensez à vérifier si un post sur ce sujet n'a pas déjà été créé."
        ].join("")
      }
    },
    name: "forum",
    subcmds: {
      rename: {
        description: "Renommer un salon post",
        name: "rename",
        options: {
          name: {
            description: "Nouveau nom du post",
            name: "name"
          }
        }
      },
      resolve: {
        description: "Définir le salon comme résolu",
        name: "resolve",
        options: {
          answer: {
            description: "Lien de la réponse",
            name: "answer"
          }
        }
      },
      why: {
        description: "Pourquoi utiliser les salons forum ?",
        name: "why"
      }
    }
  },
  main: {
    description: "Ajouter, supprimer ou afficher les salons/rôles principaux",
    exec: {
      add: {
        channel: {
          error: "Erreur lors de l'ajout du salon",
          succes: "<#{channelId}> a bien été ajouté a `{category}` !"
        },
        role: {
          error: "Erreur lors de l'ajout du rôle",
          succes: "<@&{roleId}> a bien été ajouté a `{category}` !"
        }
      },
      list: {
        channels: {
          channel: "**{category} :** {members}",
          title: "Salons principaux"
        },
        roles: {
          role: "**{category} :** {members}",
          title: "Rôles principaux"
        }
      },
      remove: {
        channel: {
          error: "Erreur lors de la suppression du salon",
          succes: "<#{channelId}> a bien été supprimé !"
        },
        role: {
          error: "Erreur lors de la suppression du rôle",
          succes: "<@&{roleId}> a bien été supprimé !"
        }
      }
    },
    groups: {
      add: {
        description: "Ajouter des salons/rôles principaux",
        name: "add",
        subcmds: {
          channel: {
            description: "Ajoute un salon à la liste des salons principaux",
            name: "channel",
            options: {
              category: {
                description: "Categorie du salon",
                name: "category"
              },
              channel: {
                description: "Salon a ajouter",
                name: "channel"
              }
            }
          },
          role: {
            description: "Ajoute un rôle à la liste des rôles principaux",
            name: "role",
            options: {
              category: {
                description: "Categorie du rôle",
                name: "category"
              },
              role: {
                description: "Rôle a ajouter",
                name: "role"
              }
            }
          }
        }
      },
      remove: {
        description: "Supprimer des salons/rôles principaux",
        name: "remove",
        subcmds: {
          channel: {
            description: "Supprimer un salon à la liste des salons principaux",
            name: "channel",
            options: {
              channel: {
                description: "Salon a supprimer",
                name: "channel"
              }
            }
          },
          role: {
            description: "Supprimer un rôle des rôles principaux",
            name: "role",
            options: {
              role: {
                description: "Rôle a supprimer",
                name: "role"
              }
            }
          }
        }
      }
    },
    name: "main",
    subcmds: {
      list: {
        description: "Affiche la liste des rôles ou salons principaux",
        name: "list"
      }
    }
  },
  inactive: {
    name: "inactive",
    description: "Afficher les membres inactifs de ce mois",
    options: {
      page: {
        name: "page",
        description: "Page a afficher"
      }
    },
    exec: {
      notGuildMember: "Exécutez cette commande sur le serveur discord",
      activityQueryError: "Erreur lors de la récupération de l'activité des membres",
      noInactiveMembers: "Il n'y a pas de membres inactifs",
      memberQueryError: "Erreur lors de la récupération du membre",
      noMember: "Ce membre n'éxiste pas",
      embed: {
        content: [
          "Le membre <@{memberId}> a envoyé un total de **{messages} messages**",
          "Il a passé un total de **{voiceTime} en vocal**\n",
          "Compte créé le **{createdAt}**, il a rejoint le serveur le **{joinedAt}**",
          "Son rang d'activité est **<@&{rankId}>**"
        ].join("\n"),
        footer: "Membre inactif n°{inactiveNumber}/{inactivesCount}"
      }
    }
  }
} satisfies Record<string, Command>;