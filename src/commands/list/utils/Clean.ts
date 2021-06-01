import { Message, TextChannel } from "discord.js";
import Client from "../../../client/Client";
import ChannelIDs from "../../../constants/ChannelIDs";
import Command from "../../Command";
import AppDiscord from "./../../../constants/AppDiscord";

export default class Clean extends Command {

    constructor(){
        super(
            "clean",
            "Permet de supprimer plusieurs messages en même temps",
            "utils",
            {
                usage: [
                    {type: "required", usage: "Nombre entre 2 et 100"}
                ],
                aliases: ["cl"]
            }
        );
    }

    public async run(args: any[], message: Message) : Promise<void> {
        if(!args[0] || isNaN(args[0]) || args[0] > 100 || args[0] < 2) {
            Client.instance.embed.sendSimple(
                this.getFormattedUsage(),
                <TextChannel>message.channel
            );
            return;
        }
        if(message.channel instanceof TextChannel) {
            message.channel.bulkDelete(+args[0] + +1).catch(error => console.log(error))
            Client.instance.embed.sendSimple(
                args[0] + " message(s) supprimé(s)",
                <TextChannel>message.channel
            ).then(message => message.delete({timeout: 4000 /* 4 secondes */}))
        } 
    }
}