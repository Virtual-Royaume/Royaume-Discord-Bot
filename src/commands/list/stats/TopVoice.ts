import { Message, TextChannel } from "discord.js";
import Client from "../../../client/Client";
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

    public async run(args: any[], message: Message) : Promise<void> {
        // const memberPerPage = 20;
        // const totalRows = await MemberActivity.count();
        // const maxPage = Math.ceil(totalRows / memberPerPage);

        // let page = 1;

        // if(args[0] && !isNaN(args[0]) && page > 0){
        //     page = args[0] > maxPage ? maxPage : Math.abs(args[0]);
        // }
        
        // const topVoiceOfPage = (await MemberActivity.find({
        //     order: {
        //         voiceMinute: "DESC"
        //     },
        //     skip: (page - 1) * memberPerPage,
        //     take: memberPerPage
        // }));

        // let scorebordMessage = "__**Classements des membres les plus actifs en vocal (en minute) (page : " + page + "/" + maxPage + ")**__\n\n";

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

        //     scorebordMessage += "**" + (i + 1 + (page - 1) * memberPerPage) + ". " + memberName + " :** " + member.voiceMinute + "\n";
        // }

        // Client.instance.embed.sendSimple(scorebordMessage, <TextChannel>message.channel);
    }
}