import { SlashCommandBuilder, SlashCommandUserOption } from "@discordjs/builders";
import { CommandInteraction, GuildMember, Message, TextChannel } from "discord.js";
import Client from "../../Client";
import Command from "../Command";

export default class Member extends Command {

    public readonly slashCommand = new SlashCommandBuilder()
        .setName("member")
        .setDescription("Voir les statistiques et information d'un utilisateur")
        .addUserOption(new SlashCommandUserOption()
            .setName("member")
        );

    public execute(command: CommandInteraction) : void {
        // let member: GuildMember|undefined|null;

        // if(args[0] && message.mentions.members){
        //     member = message.mentions.members.first();
        // } else {
        //     member = message.member;
        // }

        // if(!(member instanceof GuildMember) || member.user.bot){
        //     Client.instance.embed.sendSimple(this.getFormattedUsage(), message.channel);

        //     return;
        // }

        // const memberActivity = await MemberActivity.findOne({userId: member.id});

        // if(memberActivity){
        //     let activityMessage = "**__Activité de <@" + member.id + ">__**\n\n";

        //     activityMessage += "**Temps de vocal (en minute) :** " + memberActivity.voiceMinute.toLocaleString("fr-FR") + "\n";
        //     activityMessage += "**Nombre de message : **" + memberActivity.totalMessageCount.toLocaleString("fr-FR") + "\n";
        //     activityMessage += "**Nombre de message ce mois : **" + memberActivity.monthMessageCount.toLocaleString("fr-FR") + "\n\n";

        //     activityMessage += "**Nombre de message par salon :**\n";
            
        //     for(const [channelID, columnName] of Object.entries(MemberActivity.channelIdsToColumnName)){
        //         activityMessage += memberActivity[columnName].toLocaleString("fr-FR") + " dans <#" + channelID + ">\n";
        //     }

        //     Client.instance.embed.sendSimple(activityMessage, message.channel);
        // } else {
        //     Client.instance.embed.sendSimple("Aucune statistique trouvée.", message.channel);
        // }
    }
}