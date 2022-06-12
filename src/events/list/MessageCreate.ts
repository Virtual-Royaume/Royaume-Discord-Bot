import { BaseGuildTextChannel, Message as Msg, TextBasedChannel } from "discord.js";
import { request } from "../../api/Request";
import { getChannels, GetChannelsType } from "../../api/requests/MainChannel";
import { incChannelMessage, IncChannelMessageType } from "../../api/requests/Member";
import { generalChannel } from "../../../resources/config/information.json";
import Event, { EventName } from "../Event";
import Client from "../../Client";
import { simpleEmbed } from "../../utils/Embed";
import { numberFormat } from "../../utils/Functions";

export default class MessageCreate extends Event {

    public name: EventName = "messageCreate";

    public async execute(message: Msg) : Promise<void> {
        if (message.author.bot) return;

        // Get channel or parent channel (if is a thread channel) :
        let channel: TextBasedChannel | null = message.channel;

        if (
            channel.type === "GUILD_PUBLIC_THREAD" || channel.type === "GUILD_PRIVATE_THREAD"
            || channel.type === "GUILD_NEWS_THREAD"
        ) {
            channel = channel.parent;
        }

        // Increment member message count :
        if (channel) {
            const channels = (await request<GetChannelsType>(getChannels)).channels;

            if (channels.find(c => c.channelId === channel?.id)) {
                const messageCount = (await request<IncChannelMessageType>(
                    incChannelMessage,
                    { id: message.author.id, channelId: channel.id }
                )).incMemberDiscordActivityChannel;

                // Send an announcement when the member reaches a message count step :
                let step = false;

                if (messageCount < 10_000) {
                    if (messageCount !== 0 && messageCount % 1_000 === 0) step = true;
                } else if (messageCount % 10_000 === 0) step = true;

                if (step) {
                    const generalChannelInstance = await (await Client.instance.getGuild()).channels.fetch(generalChannel);

                    if (!(generalChannelInstance instanceof BaseGuildTextChannel)) return;

                    generalChannelInstance.send({
                        embeds: [simpleEmbed(
                            `<@${message.author.id}> vient de passer le cap des ${numberFormat(messageCount)} messages envoyés ! 🎉`
                        )]
                    });
                }
            }
        }
    }
}