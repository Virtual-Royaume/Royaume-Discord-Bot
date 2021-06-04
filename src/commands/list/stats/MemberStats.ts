import { GuildMember, Message, TextChannel } from "discord.js";
import Client from "../../../client/Client";
import MemberActivity from "../../../database/member/MemberActivity";
import Command from "../../Command";

export default class WatchTogether extends Command {

    constructor(){
        super(
            "member-stats",
            "Voir les statistiques d'activité d'un utilisateur",
            "statistiques",
            {
                aliases: ["m-stats", "ms"],
                usage: [
                    {type: "optional", usage: "mentionner un membre"}
                ]
            }
        );
    }

    public async run(args: any[], message: Message) : Promise<void> {
        let member: GuildMember|undefined|null;

        if(args[0] && message.mentions.members){
            member = message.mentions.members.first();
        } else {
            member = message.member;
        }

        if(!(member instanceof GuildMember)){
            Client.instance.embed.sendSimple(this.getFormattedUsage(), <TextChannel>message.channel);

            return;
        }

        const memberActivity = await MemberActivity.findOne({userId: member.id});

        if(memberActivity){
            let activityMessage = "**__Activité de <@" + member.id + ">__**\n\n";

            activityMessage += "**Temps de vocal (en minute) :** " + memberActivity.voiceMinute.toLocaleString("fr-FR") + "\n";
            activityMessage += "**Nombre de message : **" + memberActivity.totalMessageCount.toLocaleString("fr-FR") + "\n";
            activityMessage += "**Nombre de message ce mois : **" + memberActivity.monthMessageCount.toLocaleString("fr-FR") + "\n\n";

            activityMessage += "**Nombre de message par salon :**\n";
            
            for(const [channelID, columnName] of Object.entries(MemberActivity.channelIdsToColumnName)){
                // @ts-ignore
                activityMessage += memberActivity[columnName].toLocaleString("fr-FR") + " dans <#" + channelID + ">\n";
            }

            Client.instance.embed.sendSimple(activityMessage, <TextChannel>message.channel);
        } else {
            Client.instance.embed.sendSimple("Aucune statistique trouvée.", <TextChannel>message.channel);
        }
    }
}