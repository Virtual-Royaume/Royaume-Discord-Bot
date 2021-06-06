import { GuildMember, Message, TextChannel } from "discord.js";
import Client from "../../../client/Client";
import ChannelIDs from "../../../constants/ChannelIDs";
import Command from "../../Command";

export default class Accept extends Command {

    constructor(){
        super(
            "accept",
            "Permet d'accepter un membre dans le serveur",
            "admin",
            {
                usage: [
                    {type: "required", usage: "ID de l'utilisateur"},
                    {type: "required", usage: "ID de son message de présentation"}
                ],
                aliases: ["a"],
                permissions: ["ADMINISTRATOR"]
            }
        );
    }

    public async run(args: any[], message: Message) : Promise<void> {

        // Get member, channel and messages instance and verify if it exist :
        const memberInstance: GuildMember|undefined = Client.instance.getGuild().members.cache.get(args[0]);
        const verifChannel: TextChannel|undefined = <TextChannel>Client.instance.getGuild().channels.cache.get(ChannelIDs.verif);

        if(!verifChannel){
            Client.instance.embed.sendSimple(
                "Le salon de vérification est introuvable...",
                <TextChannel>message.channel
            );
            return;
        }
        
        verifChannel.messages.fetch(args[1]).then(messageInstance => {
            if(!memberInstance){
                Client.instance.embed.sendSimple(
                    "Cette utilisateur n'est pas sur le Discord.",
                    <TextChannel>message.channel
                );
                return;
            }
            
            if(!messageInstance){
                Client.instance.embed.sendSimple(
                    "Ce message de présentation n'existe pas.",
                    <TextChannel>message.channel
                );
                return;
            }

            // Edit member roles :
            const rolesCache = Client.instance.getGuild().roles.cache;

            const roleVerif = rolesCache.filter(role => role.name === "verif").first();
            const roleEcuyer = rolesCache.filter(role => role.name === "Ecuyer").first();

            if(roleVerif && roleEcuyer){
                memberInstance.roles.remove(roleVerif);
                memberInstance.roles.add(rolesCache);
            } else {
                Client.instance.embed.sendSimple(
                    "Impossible d'éditer les rôles du membre un des rôles suivant n'est pas accessible : verif, Ecuyer.",
                    <TextChannel>message.channel
                );
            }

            // Send welcome message with new member presentation :
            Client.instance.embed.sendSimple(
                "Bienvenue officiellement parmis nous <@" + memberInstance.id + "> !\n\n" +
                
                "Les rôles que vous voyez sur votre droite sont définis selon votre activité ainsi que " + 
                "l'importance que vous portez au Royaume !\n\n" +

                "Pour pouvoir accéder aux différents salons de la catégorie travail vous pouvez faire la " + 
                "commande ``-role`` dans <#" + ChannelIDs.command + "> et choisir les rôles qui vous " + 
                "correspondent.\n\n",

                <TextChannel>Client.instance.getGuild().channels.cache.get(ChannelIDs.general)
            );

            Client.instance.embed.sendSimple(
                "**Voici la présentation de <@" + memberInstance.id + "> :**\n\n" +
                
                messageInstance.content,

                <TextChannel>Client.instance.getGuild().channels.cache.get(ChannelIDs.general)
            );

            // Mention the new member :
            const generalChannel: TextChannel|undefined = <TextChannel>Client.instance.getGuild().channels.cache.get(ChannelIDs.general);

            if(generalChannel) generalChannel.send("<@" + memberInstance.id + ">").then(mentionMsg => mentionMsg.delete());
        });
    }
}