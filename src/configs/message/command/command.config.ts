import type { Command } from "#/configs/message/command/command.type";

export const commands = {
  birthday: {
    name: "anniversaire",
    description: "Définir et afficher les anniversaires",
    exec: {
      apiError: "Erreur lors de la récupération des dates d'anniversaires",
      list: {
        birthdayLine: "**{position}\\. {username} :** {age} ans ({date})\n",
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
        tooYoung: "L'age minimum requis est de {minimumAge} ans.",
        queryError: "Erreur lors de la sauvegarde de votre anniversaire"
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
        unpinnableMessage: "Le message ne peut pas être épinglé..."
      },
      why: {
        user: "<@{userId}> pourquoi n'as-tu pas utilisé le salon forum ?",
        message: [
          "- Les salons forums sont la pour éviter que vos questions ou problèmes soit perdu dans la masse des messages du salon <#{channelId}>\n\n",
          "- Y ajouter un titre correct permet de vérifier rapidement si votre problème est déjà résolu ou non.\n\n",
          "- Les salons forum sont là pour vous permettre de poser des questions et de trouver des réponses.\n\n",
          "- Cela permet de garder un maximum de clarté car vous ne vous mélanger pas avec la discussion générale.\n\n",
          "- Garder une trace des questions et des réponses, il est plus facile pour les membres de retrouver la réponse dont ils pourraient avoir",
          " besoin dans les salons forums.\n\n",
          "- Il est plus motivant pour la personne qui vous aide à pouvoir le faire de manière isolée avec une trace dans le temps plus forte.\n\n",
          "- Que votre question soit très simple ou complexe les forums seront mieux, une aide sur plusieurs jours dans un salon isolé permet ",
          "un meilleur suivi et les meilleures questions du célèbre forum d'aide Stack overflow sont les plus simples.\n\n",
          "- Avant de créer votre propre post avec une question similaire ou identique",
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
        options: {
          user: {
            name: "user",
            description: "Utilisateur à cibler"
          }
        },
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
        error: "Erreur lors de l'obtention des salons",
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
      unableFetchGuildMembers: "Impossible de récupérer la liste des membres du serveurs",
      notInGuild: "Exécutez cette commande sur le serveur \"pro\" du Royaume",
      noChannel: "Exécutez cette commande dans un salon textuel",
      notGuildMember: "Exécutez cette commande sur le serveur discord",
      activityQueryError: "Erreur lors de la récupération de l'activité des membres",
      noInactiveMembers: "Il n'y a pas de membres inactifs",
      memberQueryError: "Erreur lors de la récupération du membre",
      embed: {
        fields: {
          member: {
            name: "Member",
            value: "<@{userId}>"
          },
          createAt: {
            name: "Create at",
            value: "{date}"
          },
          joinAt: {
            name: "Join server at",
            value: "{date}",
            defaultValue: "??/??/????"
          },
          messages: {
            name: "Total messages",
            value: "{messagesCount}"
          },
          minutes: {
            name: "Total minutes",
            value: "{minutes} minutes"
          },
          activityTier: {
            name: "Activity Tier",
            value: "<@&{roleId}>"
          }
        },
        footer: "Membre inactif n°{page}/{maxPage}"
      },
      modal: {
        title: "Expultion de {username}",
        label: "Raison"
      },
      kick: {
        noPermission: "Vous n'avez pas la permission d'expulser se membre",
        botCantKick: "Le bot ne peut pas expulser cet utilisateur",
        kickTimeExpired: "Vous avez mis trop de temps pour choisir une raison, le kick a été annulé",
        memberKicked: "<@{userId}> a été kick",
        errorWhileKicking: "Erreur lors de l'expulsion du membre",
        kickMessage: "Vous avez été exclu du Royaume pour : **{reason}**",
        kickReason: "{username} : {reason}",
        kickDefaultReason: "Inactivité"
      }
    }
  },
  member: {
    name: "member",
    description: "Statistiques et information d'un utilisateur",
    options: {
      member: {
        name: "member",
        description: "Membre ciblé"
      }
    },
    exec: {
      isntInGuild: "Vous devez être sur un serveur discord pour faire cette commande",
      isntInOfficialGuild: "Cette commande doit être éxecuté sur un des serveurs du Royaume",
      memberQueryError: "Erreur lors de la récupération du membre",
      memberDoesntExist: "Ce membre n'éxiste pas",
      channelsQueryError: "Erreur lors de la récupération des salons",
      embed: {
        title: "Activité de {displayName}",
        birth: "**👶 Né le {date} ({yearsOld} ans)**\n\n",
        progress: {
          up: "📈 **Rôle d'activité :** {role} *(rôle en augmentation)*\n\n",
          neutral: "📊 **Rôle d'activité :** {role} *(rôle en stagnation)*\n\n",
          down: "📉 **Rôle d'activité :** {role} *(rôle en diminution)*\n\n"
        },
        activity: [
          "**🔊 Temps de vocal :** {time}\n",
          "**🔉 Temps de vocal ce mois :** {time}\n\n",
          "**📜 Nombre de message :** {messagesCount}\n",
          "**📝 Nombre de message ce mois :** {messagesCount}\n\n",
          "**📺 Nombre de message par salon :**"
        ].join(""),
        channelActivityRow: "{messageCount} dans <#{channelId}>"
      }
    }
  },
  role: {
    name: "role",
    description: "Choisir ses rôles",
    exec: {
      notInGuild: "Veuillez éxecuter cette commande sur un serveur",
      apiError: "Erreur lors de l'obtention des rôles",
      selectRole: "Veuillez choisir vos rôles"
    }
  },
  roulette: {
    name: "roulette",
    description: "Choisir une valeur aléatoire parmis une liste d'éléments",
    exec: {
      modal: {
        name: "Roulette",
        title: {
          label: "Titre",
          placeholder: "facultatif"
        },
        choices: {
          label: "Différents choix",
          placeholder: [
            "choix 1",
            "choix 2",
            "choix 3",
            "..."
          ].join("\n")
        }
      }
    }
  },
  stats: {
    name: "stats",
    description: "Voir les statistiques du serveurs",
    options: {
      history: {
        name: "history",
        description: "Taille de l'historique en jours"
      },
      darkMode: {
        name: "dark",
        description: "Graphique mode sombre"
      }
    },
    exec: {
      historyQueryError: "Erreur lors de la récupération de l'historique",
      title: "**Statistiques sur {days} jours**",
      voices: "Temps de vocal des utilisateurs en minutes",
      messages: "Nombre de messages envoyés",
      members: "Nombre de membres présents sur le serveur"
    }
  },
  topMessage: {
    name: "top-message",
    description: "Classement des membres les plus actifs textuellement",
    subcmds: {
      total: {
        name: "total",
        description: "Classement du nombre total de messages",
        options: {
          page: {
            name: "page",
            description: "Page du classement"
          }
        }
      },
      month: {
        name: "month",
        description: "Classement du nombre mensuel de messages",
        options: {
          page: {
            name: "page",
            description: "Page du classement"
          }
        }
      },
      channel: {
        name: "channel",
        description: "Classement du nombre de messages par salon",
        options: {
          page: {
            name: "page",
            description: "Page du classement"
          },
          channel: {
            name: "channel",
            description: "Classement du salon"
          }
        }
      }
    },
    exec: {
      activityQueryError: "Erreur lors de la récupération des statistiques",
      embed: {
        title: "Classements des membres les plus actifs *(source: {source})*",
        format: "**{position}\\. {username} :** {nbrMessages}\n",
        footer: "Page: {page}/{maxPage}"
      }
    }
  },
  topVoice: {
    name: "top-voice",
    description: "Classement des membres les plus actifs vocalement",
    subcmds: {
      total: {
        name: "total",
        description: "Classement du nombre total de minutes",
        options: {
          page: {
            name: "page",
            description: "Page du classement"
          }
        }
      },
      month: {
        name: "month",
        description: "Classement du nombre mensuel de minutes",
        options: {
          page: {
            name: "page",
            description: "Page du classement"
          }
        }
      }
    },
    exec: {
      activityQueryError: "Erreur lors de la récupération des statistiques",
      embed: {
        title: "Classements des membres les plus actifs *(source: {source})*",
        format: "**{position}\\. {username} :** {nbrMessages}\n",
        footer: "Page: {page}/{maxPage}"
      }
    }
  }
} satisfies Record<string, Command>;