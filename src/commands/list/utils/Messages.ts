import { Message, TextChannel } from "discord.js";
import Client from "../../../client/Client";
import User from "../../../database/User";
import Command from "../../Command";

export default class WatchTogether extends Command {

    constructor(){
        super(
            "messages",
            "Voir le classement du nombre de message envoyé",
            "utils",
            {
                aliases: ["msg"]
            }
        );
    }

    public async run(args: any[], message: Message) : Promise<void> {
        let scoreboardSize = 1;
        let scoreboardMessage = "**__Classement des membres avec le plus de message__**\n\n";

        (await User.find({
            select: ["userId", "totalMessageCount"],
            order: {
                totalMessageCount: "DESC"
            }
        })).forEach(user => {
            if(scoreboardSize <= 20){
                scoreboardMessage += "**[" + scoreboardSize + "] <@" + user.userId + "> :** " + user.totalMessageCount + "\n";
                scoreboardSize++;
            }
        });

        Client.instance.embed.sendSimple(scoreboardMessage, <TextChannel>message.channel);
    }
}