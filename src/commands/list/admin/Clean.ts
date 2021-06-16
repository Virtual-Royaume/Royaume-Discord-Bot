import { Message, TextChannel } from "discord.js";
import Client from "../../../client/Client";
import Command from "../../Command";

export default class Clean extends Command {

    constructor(){
        super(
            "clean",
            "Permet de supprimer plusieurs messages en même temps",
            "admin",
            {
                usage: [
                    {type: "required", usage: "nombre entre 1 et 100"}
                ],
                aliases: ["clear", "cl"],
                permissions: ["ADMINISTRATOR"],
                allowedChannels: "EVERY"
            }
        );
    }

    public async run(args: any[], message: Message) : Promise<void> {
        if(isNaN(args[0]) || args[0] < 1 || args[0] > 100){
            Client.instance.embed.send(
                this.getFormattedUsage(),
                message.channel
            );

            return;
        }

        (message.channel as TextChannel).bulkDelete(Number(args[0]) + 1).then(() => {
            Client.instance.embed.send(
                "**" + args[0] + "** message(s) supprimé(s). Ce message sera lui aussi supprimé dans quelques secondes...",
                message.channel
            ).then(msg => {
                setTimeout(() => {
                    if(!msg.deleted) msg.delete();
                }, 10000 /* 10 secondes */);
            });
        });
    }
}