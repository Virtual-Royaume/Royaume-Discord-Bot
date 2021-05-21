import {TextChannel, DMChannel, MessageEmbed, Message, NewsChannel} from "discord.js";

import Constants from "../../constants/Constants";

export default class Embed {

    public sendSimple(message: string, channel: TextChannel|DMChannel|NewsChannel) : Promise<Message> {
        const embed = new MessageEmbed();

        embed.setColor(Constants.color);
        embed.setDescription(message);        

        return channel.send(embed);
    }
}