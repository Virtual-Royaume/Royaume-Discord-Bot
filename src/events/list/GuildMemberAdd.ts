import { GuildMember, TextChannel } from "discord.js";
import Client from "../../client/Client";
import ChannelIDs from "../../constants/ChannelIDs";

export default class GuildMemberAdd {
    
    public async run(member: GuildMember){
        /*Client.instance.embed.sendSimple(
            "Bienvenue <@" + member.id + "> !\n\n" +
    
            "**Le Royaume** est un serveur privé amical où la bonne ambiance est donc obligatoire ! " +
            "Ici on parle principalement de programmation, trading (notamment de crypto-monnaie), " + 
            "graphisme, sneakers et d'autres choses encore. Parfois on joue ou on regarde des films " + 
            "ensemble aussi... 🍿\n\n" +
            
            "Les rôles que vous voyez sur votre droite sont définis selon votre activité ainsi que " + 
            "l'importance que vous portez au Royaume !\n\n" +
    
            "Pour pouvoir accéder aux différents salons de la catégorie travail vous pouvez faire la " + 
            "commande ``-role`` dans <#" + ChannelIDs.command + "> et choisir les rôles qui vous " + 
            "correspondent.\n\n" + 
            
            "Pour finir, on aimerait avoir une petite présentation de vous, parlez nous de vos projets, " + 
            "vos ambitions ainsi de ce que vous savez faire sur internet !",
    
            <TextChannel>Client.instance.channels.cache.get(ChannelIDs.general)
        );*/

        const verifChannel: TextChannel = <TextChannel>Client.instance.channels.cache.get(ChannelIDs.verif);
            
        Client.instance.embed.sendSimple(
            "Bienvenue <@" + member.id + ">, tu es dans le salon de vérification des nouveaux membres !\n\n" +
    
            "**Le Royaume** est un serveur privé amical où la bonne ambiance est donc obligatoire ! " +
            "Ici on parle principalement de programmation, trading (notamment de crypto-monnaie), " + 
            "graphisme, sneakers et d'autres choses encore. Parfois on joue ou on regarde des films " + 
            "ensemble aussi... 🍿\n\n" +
    
            "Si les domaines cités ci-dessus te correspondent et que tu as envie de faire parti de " +
            "cette communauté privée et d'évoluer avec nous, il faudra que tu fasses une petite présentation " +
            "de toi, tes ambitions, tes projets, tes centres d'intêret... Donne nous envie quoi !\n\n" +
    
            "Nous reviendrons vers toi si tu as l'air cool !",
    
            verifChannel
        );
        
        verifChannel.send("<@" + member.id + ">").then(mentionMsg => mentionMsg.delete());

        const role = Client.instance.getGuild().roles.cache.filter(role => role.name === "verif").first(); 

        if(role) member.roles.add(role);
    }
}