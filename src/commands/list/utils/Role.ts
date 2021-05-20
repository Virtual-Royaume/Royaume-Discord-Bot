import { Message } from "discord.js";
import Command from "../../Command";

export default class Role extends Command {

    constructor(){
        super(
            "role",
            "Permet de choisir ses rôles",
            "utils"
        );
    }

    public run(args: any[], message: Message): void {
        /*let rolesWithCategory = {
            Travail: ["dev", "sneakers", "graphisme", "crypto", "drop"],
            Jeux: ["mini-games", "csgo", "sea-of-thieves"],
            Divertissement: ["film"]
        };
        
        let roles = [].concat(...Object.values(rolesWithCategory));

        if(args.length === 0 || roles.indexOf(args[0]) == -1){
            Client.instance.embed.sendSimple(
                "Vous devez faire ``-role (le rôle que vous souhaitez obtenir ou retirer)`` !", 
                <TextChannel>message.channel
            );

            let rolesList = "**__Liste des rôles disponibles__**\n\n";

            for([category, roles] of Object.entries(rolesWithCategory)){
                rolesList += "**" + category + " :** " + roles.join(", ") + "\n\n";
            }

            embed.send(rolesList, message.channel);
            return;
        }

        let member = message.member;
        let role = args[0];
        let roleInstance = message.guild.roles.cache.filter(r => r.name === role).first();

        if(member.roles.cache.filter(r => r.name === role).size > 0){
            member.roles.remove(roleInstance);

            embed.send("Votre rôle **" + role + "** a bien été supprimé.", message.channel);
        } else {
            member.roles.add(roleInstance);

            embed.send("Vous avez desormais le rôle **" + role + "** !", message.channel);
        }*/
    }
}