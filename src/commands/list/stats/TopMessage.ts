import { Message, TextChannel } from "discord.js";
import Client from "../../../client/Client";
import Command from "../../Command";

export default class TopVoice extends Command {

    constructor(){
        super(
            "topmessage",
            "Voir le classement des membres les plus actifs en terme de nombre de message",
            "statistiques",
            {
                aliases: ["tmsg"],
                usage: [
                    {type: "required", usage: "total, mois ou mention d'un channel"},
                    {type: "optional", usage: "page"}
                ]
            }
        );
    }

    public async run(args: any[], message: Message) : Promise<void> {
        // Get message category (specific channel, total, month) :
        // let columnName: string;
        // let category: string;

        // if((!["total", "mois"].includes(args[0]) && !(message.mentions.channels.first() instanceof TextChannel))){
        //     Client.instance.embed.sendSimple(this.getFormattedUsage(), <TextChannel>message.channel);

        //     return;
        // } else {
        //     const channel = message.mentions.channels.first();

        //     if(channel instanceof TextChannel){
        //         columnName = MemberActivity.channelIdsToColumnName[channel.id];
        //         category = "<#" + channel.id + ">";
        //     } else {
        //         columnName = args[0] === "mois" ? "monthMessageCount" : "totalMessageCount";
        //         category = args[0] === "mois" ? "mois" : "total";
        //     }
        // }

        // // Get page :
        // const memberPerPage = 20;
        // const totalRows = await MemberActivity.count();
        // const maxPage = Math.ceil(totalRows / memberPerPage);

        // let page = 1;

        // if(args[1] && !isNaN(args[1]) && page > 0){
        //     page = args[1] > maxPage ? maxPage : Math.abs(args[1]);
        // }
        
        // // Send scoreboard :
        // const topVoiceOfPage = (await MemberActivity.find({
        //     order: {
        //         [columnName]: "DESC"
        //     },
        //     skip: (page - 1) * memberPerPage,
        //     take: memberPerPage
        // }));

        // let scorebordMessage = "__**Classements selon le nombre de message (" + category + ") (page : " + page + "/" + maxPage + ")**__\n\n";

        // for(let i = 0; i < topVoiceOfPage.length; i++){
        //     const member = topVoiceOfPage[i];
        //     const guildMember = Client.instance.getGuild().members.cache.get(member.userId);
            
        //     let memberName: string;

        //     if(guildMember){
        //         memberName = guildMember.displayName;
        //     } else {
        //         // @ts-ignore
        //         memberName = (await Member.findOne({userId: member.userId})).username;
        //     }

        //     // @ts-ignore
        //     scorebordMessage += "**" + (i + 1 + (page - 1) * memberPerPage) + ". " + memberName + " :** " + member[columnName] + "\n";
        // }

        // Client.instance.embed.sendSimple(scorebordMessage, <TextChannel>message.channel);
    }
}