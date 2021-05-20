import { Message } from "discord.js";
import Command from "../../Command";

export default class Accept extends Command {

    constructor(){
        super(
            "accept",
            "Permet d'accepter un membre dans le serveur",
            "modération"
        );
    }

    public run(args: any[], message: Message): void {
        /*if(args.length < 2){
            embed.send("Vous devez faire ``-accept (ID de l'utilisateur) (ID de son message de présentation)`` !", message.channel)
            return;
        }
        
        let memberInstance = bot.guilds.cache.first().members.cache.get(args[0]);
        
        bot.guilds.cache.first().channels.cache.get(constants.CHANNEL_VERIF).messages.fetch(args[1]).then(messageInstance => {
            if(!memberInstance){
                embed.send("Cette utilisateur n'est pas sur le Discord.", message.channel);
                return;
            }
            
            if(!messageInstance){
                embed.send("Ce message de présentation n'existe pas.", message.channel);
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

                bot.channels.cache.get(ChannelIDs.general)
            );

            bot.channels.cache.get(constants.CHANNEL_GENERAL).send("<@" + memberInstance.id + ">").then(mentionMsg => mentionMsg.delete());
        });*/
    }
}