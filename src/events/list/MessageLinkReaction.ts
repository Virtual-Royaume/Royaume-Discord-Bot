import { BaseGuildTextChannel, Message, EmbedBuilder, TextBasedChannel } from "discord.js";
import Client from "$core/Client";
import { simpleEmbed } from "$core/utils/Embed";
import Event, { EventName } from "$core/events/Event";
import { msg } from "$core/utils/Message";

export default class MessageLinkReaction extends Event {

    public name: EventName = "messageCreate";

    public async execute(message: Message): Promise<void> {
        // Checks :
        if (message.author.bot && !(message.channel instanceof BaseGuildTextChannel)) return;

        const urls = message.content.match(/http(s?):\/\/(www\.)?discord.com\/channels(\/\d*){3}/gi);

        if (!urls) return;

        // Get messages :
        interface MessageElement {
            url: string;
            message: Message;
        }

        const messages: MessageElement[] = [];

        for (const url of urls) {
            const ids = [...url.matchAll(/(\/\d+)/g)];

            if (!ids.length) return;

            // Get channel and message instances :
            let channelQuoted: TextBasedChannel;
            let messageQuoted: Message;

            try {
                // Channel :
                const tempChannel = await (await Client.instance.getGuild()).channels.fetch(ids[1][0]);

                if (!tempChannel || !tempChannel.isTextBased()) throw new Error("Channel not found");

                channelQuoted = tempChannel;

                messageQuoted = await channelQuoted.messages.fetch(ids[2][0]);
            } catch {
                return;
            }

            messages.push({ url, message: messageQuoted });
        }

        // Send link reaction messages :
        const embeds: EmbedBuilder[] = [];

        for (const index in messages) {
            const url = messages[index].url;
            const message = messages[index].message;

            const attachment = message.attachments.size ? msg("event-messagelinkreaction-exec-attachments", [message.attachments.size]) : "";
            const content = message.content ? message.content + (attachment.length ? `\n\n${attachment}` : "") : attachment;

            embeds.push(
                simpleEmbed(msg("event-messagelinkreaction-exec-replyed-embed", [Number(index) + 1, url, message.channelId, content]), "normal")
                    .setAuthor({
                        name: msg.author.tag,
                        iconURL: msg.author.displayAvatarURL()
                    })
            );
        }

        message.reply({ embeds, allowedMentions: { repliedUser: false } });
    }
}