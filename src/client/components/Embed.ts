import { TextChannel, DMChannel, MessageEmbed } from "discord.js";

import Constants from "../../constants/Constants";

export default class Embed {

    public sendSimple(message: string, channel: TextChannel|DMChannel){
        let embed = new MessageEmbed();

        embed.setColor(Constants.color);
        embed.setDescription(message);        

        channel.send(embed);
    }
}