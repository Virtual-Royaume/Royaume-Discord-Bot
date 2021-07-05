import { Message, TextChannel } from "discord.js";
import Client from "../../../client/Client";
import Member from "../../../database/src/models/Member";
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

    public async run(args: string[], message: Message) : Promise<void> {
        // Get message category (specific channel, total, month) :
        let columnName: string;
        let category: string;

        if((!["total", "mois"].includes(args[0]) && !(message.mentions.channels.first() instanceof TextChannel))){
            Client.instance.embed.sendSimple(this.getFormattedUsage(), <TextChannel>message.channel);

            return;
        } else {
            const channel = message.mentions.channels.first();

            if(channel instanceof TextChannel){
                columnName = "activity.channelsMessageCount." + Member.channelIDToPropertyName[channel.id];
                category = "<#" + channel.id + ">";
            } else {
                columnName = "activity." + (args[0] === "mois" ? "monthMessageCount" : "messageCount");
                category = args[0] === "mois" ? "mois" : "total";
            }
        }

        // Get page :
        const memberPerPage = 20;
        const totalRows = await Member.MemberModel.count();
        const maxPage = Math.ceil(totalRows / memberPerPage);

        const argPage = Number(args[0])

        let page = 1;

        if(args[0] && !isNaN(argPage) && page > 0){
            page = argPage > maxPage ? maxPage : Math.abs(argPage);
        }
        
        // Send scoreboard :
        const topMessageOfPage = await Member.MemberModel.find({})
            .sort({[columnName]: -1})
            .skip((page - 1) * memberPerPage).limit(memberPerPage)
            .exec();

        let scorebordMessage = "__**Classements selon le nombre de message (" + category + ") (page : " + page + "/" + maxPage + ")**__\n\n";

        for(let i = 0; i < topMessageOfPage.length; i++){
            const member = topMessageOfPage[i];
            const guildMember = Client.instance.getGuild().members.cache.get(member._id);
            
            let memberName: string;

            if(guildMember){
                memberName = guildMember.displayName;
            } else {
                memberName = member.username;
            }

            // this line can cause compilation error, need to find a way to avoid this kind of syntaxe
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore 
            const memberColumn = member[columnName]

            scorebordMessage += "**" + (i + 1 + (page - 1) * memberPerPage) + ". " + memberName + " :** " + memberColumn + "\n";
        }

        Client.instance.embed.sendSimple(scorebordMessage, <TextChannel>message.channel);
    }
}