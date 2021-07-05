import { Message, TextChannel } from "discord.js";
import Client from "../../../client/Client";
import { TextChannel as TC } from "../../../constants/ChannelID";
import Command from "../../Command";
import AppDiscord from "./../../../constants/AppDiscord";

export default class WatchTogether extends Command {

    constructor(){
        super(
            "watch-together",
            "Permet de générer une invitation pour l'intégration vocal \"Youtube Together\"",
            "utils",
            {
                aliases: ["wt"]
            }
        );
    }

    public async run(args: string[], message: Message) : Promise<void> {
        if(!message.member?.voice.channelID){
            Client.instance.embed.sendSimple(
                "Vous devez être dans un salon vocal.",
                <TextChannel>message.channel
            );

            return;
        }
    
        const instance = Client.instance;
        const generalChannel = Client.instance.getGuild().channels.cache.get(TC.general);

        if(!generalChannel || !(generalChannel instanceof TextChannel)) return;
    
        // we asume access to a private methods
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        instance.api.channels(message.member.voice.channelID).invites.post({
            data: {
                temporary: true,
                max_age: 86400, // one day
                max_uses: 0,
                unique: true,
                target_type: 2,
                target_application_id: AppDiscord.youtubeTogether,
            }
        }).then((invite: {code: string}) : void => {
            Client.instance.embed.sendSimple(
                "<@" + message.author.id + "> a lancé **Youtube Together** !\n\n" +

                "[Rejoindre l'activité](https://discord.gg/" + invite.code + ")",

                generalChannel
            );

            Client.instance.embed.sendSimple(
                "Votre activité (**Youtube Together**) a bien était lancé, vous pouvez la rejoindre via cette invitation : https://discord.gg/" + invite.code,
                <TextChannel>message.channel
            );
        });
    }
}