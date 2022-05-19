import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, TextChannel } from "discord.js";
import Client from "../../Client";
import Command from "../Command";

export default class Inactive extends Command {

    public readonly slashCommand = new SlashCommandBuilder()
        .setName("inactive")
        .setDescription("Voir les membres inactifs ce mois-ci");
    
    public readonly defaultPermission: boolean = true;

    public execute(command: CommandInteraction) : void {
        // const inactives = await MemberActivity.find({
        //     where: {
        //         monthMessageCount: 0
        //     },
        //     take: 30
        // });

        // const membersOnTheServer = await Member.find({
        //     where: {
        //         alwaysInTheServer: true
        //     }
        // });

        // const inactivesOnTheServer = inactives.filter(
        //     member => membersOnTheServer.find(memberOnTheServer => memberOnTheServer.userId === member.userId)
        // );

        // if(inactivesOnTheServer.length){
        //     Client.instance.embed.sendSimple(
        //         "**__Liste des membres inactif__**\n\n" + inactivesOnTheServer.map(element => "<@" + element.userId + ">").join(", ") + ".", 
        //         message.channel
        //     );
        // } else {
        //     Client.instance.embed.sendSimple("Aucun membre n'est inactif.", message.channel);
        // }   
    }
}