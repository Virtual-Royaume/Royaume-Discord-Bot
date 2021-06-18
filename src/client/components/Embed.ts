import {TextChannel, DMChannel, MessageEmbed, Message, NewsChannel, MessageAttachment, FileOptions} from "discord.js";

import {TextChannel, DMChannel, MessageEmbed, Message, NewsChannel, FileOptions} from "discord.js";
import { defaultColor } from "../../constants/Color";

interface EmbedOptions {
    title?: string,
    image?: FileOptions
}

export default class Embed {

    public send(message: string, channel: TextChannel|DMChannel|NewsChannel, options: EmbedOptions|null = null) : Promise<Message> {
        const embed = new MessageEmbed();

        embed.setColor(defaultColor);
        embed.setDescription(message);        

        if(options?.title) embed.setTitle(options.title);
        if(options?.image){
            embed.attachFiles([options.image]);
            embed.setImage("attachment://" + (embed.files[0] as FileOptions).name);
        }

        return channel.send(embed);
    }
}