import { Message, NonThreadGuildBasedChannel } from "discord.js";
import Client from "../../Client";
import { simpleEmbed } from "../../utils/Embed";
import Event, { EventName } from "../Event";

export default class MessageLinkReaction extends Event {

    public name: EventName = "messageCreate";

    private regexLinkIdentification = /http(s?):\/\/(www\.)?discord.com\/channels(\/\d*){3}/i;

    public async execute(message: Message) : Promise<void> {

        if(message.author.bot) return;

        const url = message.content.match(this.regexLinkIdentification)?.shift();

        if(!url) return;

        const ids = url.match(/((\/\d*){2})$/i)?.shift()?.split("/");
        if(!ids) return;
        ids.shift(); // remove the empty string from array
        const channelId = ids[0];
        const messageId = ids[1];

        let channelQuoted: NonThreadGuildBasedChannel|null;
        let messageQuoted: Message;
        try {
            channelQuoted = await (await Client.instance.getGuild()).channels.fetch(channelId);
            if(!channelQuoted || !channelQuoted.isText()) return; 
            messageQuoted = await channelQuoted.messages.fetch(messageId);
        } catch {
            return;
        }

        if(!messageQuoted.content) return;

        message.reply({
            embeds: [
                simpleEmbed(`__**[Message de <@${messageQuoted.author.id}> dans <#${channelQuoted.id}> :](${url})**__`)
                .setAuthor({  
                    name: message.author.tag,
                    iconURL: message.author.displayAvatarURL(),
                })
                .addField(
                    "\u200b",
                    messageQuoted.content
                )
            ],
            allowedMentions: {
                repliedUser: false
            }
        });
    }
}