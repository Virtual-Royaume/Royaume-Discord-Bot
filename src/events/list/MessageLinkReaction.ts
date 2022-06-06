import { BaseGuildTextChannel, GuildChannel, Message, MessageEmbed, NonThreadGuildBasedChannel } from "discord.js";
import Client from "../../Client";
import { simpleEmbed } from "../../utils/Embed";
import Event, { EventName } from "../Event";

export default class MessageLinkReaction extends Event {

    public name: EventName = "messageCreate";

    public async execute(message: Message) : Promise<void> {
        // Checks :
        if(message.author.bot && !(message.channel instanceof BaseGuildTextChannel)) return;

        const urls = message.content.match(/http(s?):\/\/(www\.)?discord.com\/channels(\/\d*){3}/gi);

        if(!urls) return;

        // Get messages :
        interface MessageElement {
            url: string;
            message: Message;
        }

        const messages: MessageElement[] = [];

        for(let url of urls){
            const ids = [...url.matchAll(/(\/\d+)/g)];

            if(!ids.length) return;

            // Get channel and message instances :
            let channelQuoted: NonThreadGuildBasedChannel;
            let messageQuoted: Message;
            
            try {
                // Channel :
                const tempChannel = await (await Client.instance.getGuild()).channels.fetch(ids[1][0]);

                if(!tempChannel || !tempChannel.isText()) throw new Error("Channel not found");

                channelQuoted = tempChannel;

                // Message :
                messageQuoted = await channelQuoted.messages.fetch(ids[2][0]);
            } catch {
                return;
            }            

            messages.push({ url, message: messageQuoted });
        }

        // Send link reaction messages :
        const embeds: MessageEmbed[] = [];

        for(let index in messages){
            const url = messages[index].url;
            const msg = messages[index].message;
            
            const attachment = msg.attachments.size ? `🗂️ ${msg.attachments.size} fichiers joint(s)` : "";
            const content = msg.content ? msg.content + (attachment.length ? `\n\n${attachment}` : "") : attachment;

            embeds.push(
                simpleEmbed(`**Message mentionné [#${Number(index) + 1}](${url}) dans <#${msg.channelId}>**\n\n${content}`, "normal")
                    .setAuthor({  
                        name: msg.author.tag,
                        iconURL: msg.author.displayAvatarURL({ dynamic: true }),
                    })
            );
        }

        message.reply({ embeds, allowedMentions: { repliedUser: false } });
    }
}