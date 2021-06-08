import { Message, TextChannel } from "discord.js";
import Client from "../../../client/Client";
import ChannelIDs from "../../../constants/ChannelID";
import Command from "../../Command";
import AppDiscord from "./../../../constants/AppDiscord";

export default class VoiceGames extends Command {

    private integrations: {[game: string]: string} = {
        "Betrayal": "773336526917861400",
        "Poker Night": "755827207812677713",
        "Fishington": "814288819477020702"
    }

    private integrationsByCodeName = Object.keys(this.integrations);

    constructor(){
        super(
            "voice-games",
            "Permet de générer une invitation pour une intégration vocal de jeu",
            "games",
            {
                usage: [
                    {type: "required", usage: "id de l'intégration"}
                ],
                aliases: ["vg"]
            }
        );
    }

    public async run(args: any[], message: Message) : Promise<void> {
        if(!Object.keys(this.integrationsByCodeName).includes(args[0])){
            Client.instance.embed.sendSimple(this.getFormattedUsage(), <TextChannel>message.channel);

            let integrationList = "__**Liste des intégrations**__\n\n";

            for(let key in this.integrationsByCodeName){
                integrationList += "**" + key + ":** " + this.integrationsByCodeName[key] + "\n";
            }
        
            Client.instance.embed.sendSimple(integrationList, <TextChannel>message.channel);

            return;
        }

        const selectedIntegration = {
            name: this.integrationsByCodeName[args[0]],
            id: this.integrations[this.integrationsByCodeName[args[0]]]
        };

        if(!message.member?.voice.channelID){
            Client.instance.embed.sendSimple(
                "Vous devez être dans un salon vocal.",
                <TextChannel>message.channel
            );

            return;
        };
    
        const instance: any = Client.instance;
        const generalChannel = Client.instance.getGuild().channels.cache.get(ChannelIDs.general);

        if(!generalChannel || !(generalChannel instanceof TextChannel)) return;
    
        instance.api.channels(message.member.voice.channelID).invites.post({
            data: {
                temporary: true,
                max_age: 86400, // one day
                max_uses: 0,
                unique: true,
                target_type: 2,
                target_application_id: selectedIntegration.id
            }
        }).then((invite: {code: string}) : void => {
            Client.instance.embed.sendSimple(
                "<@" + message.author.id + "> a lancé le jeu **" + selectedIntegration.name + "** !\n\n" +

                "[Rejoindre le jeu](https://discord.gg/" + invite.code + ")",

                generalChannel
            );

            Client.instance.embed.sendSimple(
                "Votre jeu (**" + selectedIntegration.name + "**) a bien était lancé, vous pouvez le rejoindre via cette invitation : https://discord.gg/" + invite.code,
                <TextChannel>message.channel
            );
        });
    }
}