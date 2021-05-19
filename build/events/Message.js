"use strict";
var discord = require("discord.js");
var constants = require("../utils/Constants");
var embed = require("../utils/Embed");
bot.on("message", function (msg) {
    var _a;
    if (msg.author.bot)
        return;
    // COMMANDS :
    if (!msg.content.startsWith(constants.COMMAND_PREFIX))
        return;
    if (msg.channel.id !== constants.CHANNEL_COMMAND) {
        embed.send("Vous ne pouvez pas faire de commande en dehors du salon <#" + constants.CHANNEL_COMMAND + ">.", msg.channel);
        return;
    }
    var args = msg.content.split(" ");
    var command = args.shift().substring(constants.COMMAND_PREFIX.length).toLowerCase();
    switch (command) {
        case "role":
            var rolesWithCategory = {
                Travail: ["dev", "sneakers", "graphisme", "crypto", "drop"],
                Jeux: ["mini-games", "csgo", "sea-of-thieves"],
                Divertissement: ["film"]
            };
            var roles = [].concat.apply([], Object.values(rolesWithCategory));
            if (args.length === 0 || roles.indexOf(args[0]) == -1) {
                embed.send("Vous devez faire ``-role (le rôle que vous souhaitez obtenir ou retirer)`` !", msg.channel);
                var rolesList = "**__Liste des rôles disponibles__**\n\n";
                for (var _i = 0, _b = Object.entries(rolesWithCategory); _i < _b.length; _i++) {
                    _a = _b[_i], category = _a[0], roles = _a[1];
                    rolesList += "**" + category + " :** " + roles.join(", ") + "\n\n";
                }
                embed.send(rolesList, msg.channel);
                return;
            }
            var member = msg.member;
            var role_1 = args[0];
            var roleInstance = msg.guild.roles.cache.filter(function (r) { return r.name === role_1; }).first();
            if (member.roles.cache.filter(function (r) { return r.name === role_1; }).size > 0) {
                member.roles.remove(roleInstance);
                embed.send("Votre rôle **" + role_1 + "** a bien été supprimé.", msg.channel);
            }
            else {
                member.roles.add(roleInstance);
                embed.send("Vous avez desormais le rôle **" + role_1 + "** !", msg.channel);
            }
            break;
        case "accept":
            if (args.length < 2) {
                embed.send("Vous devez faire ``-accept (ID de l'utilisateur) (ID de son message de présentation)`` !", msg.channel);
                return;
            }
            var memberInstance_1 = bot.guilds.cache.first().members.cache.get(args[0]);
            bot.guilds.cache.first().channels.cache.get(constants.CHANNEL_VERIF).messages.fetch(args[1]).then(function (messageInstance) {
                if (!memberInstance_1) {
                    embed.send("Cette utilisateur n'est pas sur le Discord.", msg.channel);
                    return;
                }
                if (!messageInstance) {
                    embed.send("Ce message de présentation n'existe pas.", msg.channel);
                    return;
                }
                var rolesCache = bot.guilds.cache.first().roles.cache;
                memberInstance_1.roles.remove(rolesCache.filter(function (role) { return role.name === "verif"; }).first());
                memberInstance_1.roles.add(rolesCache.filter(function (role) { return role.name === "Ecuyer"; }).first());
                embed.send("Bienvenue officiellement parmis nous <@" + memberInstance_1.id + "> !\n\n" +
                    "Les rôles que vous voyez sur votre droite sont définis selon votre activité ainsi que " +
                    "l'importance que vous portez au Royaume !\n\n" +
                    "Pour pouvoir accéder aux différents salons de la catégorie travail vous pouvez faire la " +
                    "commande ``-role`` dans <#" + constants.CHANNEL_COMMAND + "> et choisir les rôles qui vous " +
                    "correspondent.\n\n", bot.channels.cache.get(constants.CHANNEL_GENERAL));
                embed.send("**Voici la présentation de <@" + memberInstance_1.id + "> :**\n\n" +
                    messageInstance.content, bot.channels.cache.get(constants.CHANNEL_GENERAL));
                bot.channels.cache.get(constants.CHANNEL_GENERAL).send("<@" + memberInstance_1.id + ">").then(function (mentionMsg) { return mentionMsg.delete(); });
            });
            break;
    }
});
