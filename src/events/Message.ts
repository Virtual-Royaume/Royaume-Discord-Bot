//const discord = require("discord.js");
const constants = require("../utils/Constants");
const embed = require("../utils/Embed");

bot.on("message", msg => {
    if(msg.author.bot) return;

    // COMMANDS :
    if(!msg.content.startsWith(constants.COMMAND_PREFIX)) return;

    if(msg.channel.id !== constants.CHANNEL_COMMAND){
        embed.send("Vous ne pouvez pas faire de commande en dehors du salon <#" + constants.CHANNEL_COMMAND + ">.", msg.channel);
        return;
    }

    let args = msg.content.split(" ");
    let command = args.shift().substring(constants.COMMAND_PREFIX.length).toLowerCase();

    switch(command){
        case "role":
            let rolesWithCategory = {
                Travail: ["dev", "sneakers", "graphisme", "crypto", "drop"],
                Jeux: ["mini-games", "csgo", "sea-of-thieves"],
                Divertissement: ["film"]
            };
            
            let roles = [].concat(...Object.values(rolesWithCategory));

            if(args.length === 0 || roles.indexOf(args[0]) == -1){
                embed.send("Vous devez faire ``-role (le rôle que vous souhaitez obtenir ou retirer)`` !", msg.channel);

                let rolesList = "**__Liste des rôles disponibles__**\n\n";

                for([category, roles] of Object.entries(rolesWithCategory)){
                    rolesList += "**" + category + " :** " + roles.join(", ") + "\n\n";
                }

                embed.send(rolesList, msg.channel);
                return;
            }

            let member = msg.member;
            let role = args[0];
            let roleInstance = msg.guild.roles.cache.filter(r => r.name === role).first();

            if(member.roles.cache.filter(r => r.name === role).size > 0){
                member.roles.remove(roleInstance);

                embed.send("Votre rôle **" + role + "** a bien été supprimé.", msg.channel);
            } else {
                member.roles.add(roleInstance);

                embed.send("Vous avez desormais le rôle **" + role + "** !", msg.channel);
            }
        break;

        case "accept":
            if(args.length < 2){
                embed.send("Vous devez faire ``-accept (ID de l'utilisateur) (ID de son message de présentation)`` !", msg.channel)
                return;
            }
            
            let memberInstance = bot.guilds.cache.first().members.cache.get(args[0]);
            
            bot.guilds.cache.first().channels.cache.get(constants.CHANNEL_VERIF).messages.fetch(args[1]).then(messageInstance => {
                if(!memberInstance){
                    embed.send("Cette utilisateur n'est pas sur le Discord.", msg.channel);
                    return;
                }
                
                if(!messageInstance){
                    embed.send("Ce message de présentation n'existe pas.", msg.channel);
                    return;
                }
    
                let rolesCache = bot.guilds.cache.first().roles.cache;
    
                memberInstance.roles.remove(rolesCache.filter(role => role.name === "verif").first());
                memberInstance.roles.add(rolesCache.filter(role => role.name === "Ecuyer").first());
    
                embed.send(
                    "Bienvenue officiellement parmis nous <@" + memberInstance.id + "> !\n\n" +
                    
                    "Les rôles que vous voyez sur votre droite sont définis selon votre activité ainsi que " + 
                    "l'importance que vous portez au Royaume !\n\n" +
    
                    "Pour pouvoir accéder aux différents salons de la catégorie travail vous pouvez faire la " + 
                    "commande ``-role`` dans <#" + constants.CHANNEL_COMMAND + "> et choisir les rôles qui vous " + 
                    "correspondent.\n\n",
    
                    bot.channels.cache.get(constants.CHANNEL_GENERAL)
                );
    
                embed.send(
                    "**Voici la présentation de <@" + memberInstance.id + "> :**\n\n" +
                    
                    messageInstance.content,
    
                    bot.channels.cache.get(constants.CHANNEL_GENERAL)
                );
    
                bot.channels.cache.get(constants.CHANNEL_GENERAL).send("<@" + memberInstance.id + ">").then(mentionMsg => mentionMsg.delete());
            });
        break;
    }
});