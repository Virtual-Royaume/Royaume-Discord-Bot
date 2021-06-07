import { Message, MessageButton, TextChannel } from "discord.js";
import Command from "../../Command";

export default class VoiceGames extends Command {

    constructor(){
        super(
            "test",
            "Faire des tests",
            "information",
            {
                aliases: ["t"]
            }
        );
    }

    public async run(args: any[], message: Message) : Promise<void> {
        let tgm = new MessageButton();

        tgm.setStyle("LINK");
        tgm.setURL("https://royaume.world");
        tgm.setLabel("Royaume website");

        message.channel.send("tgm", {components: [tgm]})
    }
}