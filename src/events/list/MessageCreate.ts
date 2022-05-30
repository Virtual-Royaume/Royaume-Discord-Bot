import { Message as Msg, TextBasedChannel } from "discord.js";
import { request } from "../../api/Request";
import { getChannels, GetChannelsType } from "../../api/requests/MainChannel";
import { incChannelMessage } from "../../api/requests/Member";
import Event from "../Event";

export default class MessageCreate extends Event {
    
    public name: string = "messageCreate";

    public async execute(message: Msg) : Promise<void> {
        if(message.author.bot) return;

        // Get channel or parent channel (if is a thread channel) :
        let channel: TextBasedChannel | null = message.channel;

        if(
            channel.type === "GUILD_PUBLIC_THREAD" || channel.type === "GUILD_PRIVATE_THREAD" ||
            channel.type === "GUILD_NEWS_THREAD"    
        ){
            channel = channel.parent;
        }

        // Increment member message count :
        if(channel){
            const channels = (await request<GetChannelsType>(getChannels)).channels;

            if(channels.find(c => c.channelId === channel?.id)){
                request(incChannelMessage, { id: message.author.id, channelId: channel.id });
            }
        }
    }
}