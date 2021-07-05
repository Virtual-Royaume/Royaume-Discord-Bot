import { Message, TextChannel } from "discord.js";
import Client from "../../../client/Client";
import Member from "../../../database/src/models/Member";
import Command from "../../Command";

export default class TopVoice extends Command {

    constructor(){
        super(
            "topvoice",
            "Voir le classement des membres les plus actifs en vocal",
            "statistiques",
            {
                aliases: ["tvoice"],
                usage: [
                    {type: "optional", usage: "page"}
                ]
            }
        );
    }

    public async run(args: string[], message: Message) : Promise<void> {
        const memberPerPage = 20;
        const totalRows = await Member.MemberModel.count();
        const maxPage = Math.ceil(totalRows / memberPerPage);

        const argPage = Number(args[0])

        let page = 1;

        if(args[0] && !isNaN(argPage) && page > 0){
            page = argPage > maxPage ? maxPage : Math.abs(argPage);
        }
        
        const topVoiceOfPage = await Member.MemberModel.find({})
            .sort({"activity.voiceMinute": -1})
            .skip((page - 1) * memberPerPage).limit(memberPerPage)
            .exec();

        let scorebordMessage = "__**Classements des membres les plus actifs en vocal (en minute) (page : " + page + "/" + maxPage + ")**__\n\n";

        for(let i = 0; i < topVoiceOfPage.length; i++){
            const member = topVoiceOfPage[i];
            const guildMember = Client.instance.getGuild().members.cache.get(member._id);
            
            let memberName: string;

            if(guildMember){
                memberName = guildMember.displayName;
            } else {
                memberName = member.username;
            }

            scorebordMessage += "**" + (i + 1 + (page - 1) * memberPerPage) + ". " + memberName + " :** " + member.activity.voiceMinute + "\n";
        }

        Client.instance.embed.sendSimple(scorebordMessage, <TextChannel>message.channel);
    }
}