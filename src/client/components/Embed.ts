import { TextChannel, DMChannel, MessageEmbed, Message } from "discord.js";

import Constants from "../../constants/Constants";

export default class Embed {

    public sendSimple(message: string, channel: TextChannel|DMChannel) : Promise<Message> {
        const embed = new MessageEmbed();

        embed.setColor(Constants.color);
        embed.setDescription(message);        

        return channel.send(embed);
    }
}