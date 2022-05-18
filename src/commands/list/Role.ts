import { SlashCommandBuilder, SlashCommandStringOption } from "@discordjs/builders";
import { GuildMember, Message, TextChannel, Role as DRole, CacheType, CommandInteraction } from "discord.js";
import Client from "../../client/Client";
import Command from "../Command";

export default class Role extends Command {

    public readonly slashCommand = new SlashCommandBuilder()
        .setName("role")
        .setDescription("Permet de choisir ses rôles");

    public execute(command: CommandInteraction) : void {
        // const rolesWithCategory: {[category: string]: string[]} = require(Client.instance.resources + "/configs/role-category.json");

        // let roles: string[] = [];
        // roles = roles.concat(...Object.values(rolesWithCategory));

        // if(roles.indexOf(args[0]) == -1){
        //     Client.instance.embed.sendSimple(
        //         this.getFormattedUsage(), 
        //         message.channel
        //     );

        //     let rolesList = "**__Liste des rôles disponibles__**\n\n";

        //     for(const [category, roles] of Object.entries(rolesWithCategory)){
        //         rolesList += "**" + category + " :** " + roles.join(", ") + "\n\n";
        //     }

        //     Client.instance.embed.sendSimple(rolesList, message.channel);
        //     return;
        // }

        // const member: GuildMember|null = message.member;
        // const role: string = args[0];
        // const roleInstance: DRole|undefined = message.guild?.roles.cache.filter(r => r.name === role).first();

        // if(member && roleInstance){
        //     if(member.roles.cache.filter(r => r.name === role).size > 0){
        //         member.roles.remove(roleInstance);
    
        //         Client.instance.embed.sendSimple(
        //             "Votre rôle **" + role + "** a bien été supprimé.",
        //             message.channel
        //         );
        //     } else {
        //         member.roles.add(roleInstance);
    
        //         Client.instance.embed.sendSimple(
        //             "Vous avez desormais le rôle **" + role + "** !",
        //             message.channel
        //         );
        //     }
        // }
    }
}