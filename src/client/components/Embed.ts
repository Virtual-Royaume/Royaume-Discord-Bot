import {TextChannel, DMChannel, MessageEmbed, Message, NewsChannel} from "discord.js";

import Constants from "../../constants/Constants";

export default class Embed {

    public sendSimple(message: string, channel: TextChannel|DMChannel|NewsChannel) : Promise<Message> {
        const embed = new MessageEmbed();

        // @ts-ignore : compatible with the type HexColorString in ColorResolvable, 
        // but not detected because of the use of a variable
        embed.setColor(Constants.color);
        embed.setDescription(message);        

        return channel.send({ embeds: [embed] });
    }
}