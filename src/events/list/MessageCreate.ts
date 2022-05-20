import { Message as Msg } from "discord.js";
import { request } from "../../api/Request";
import { getChannels } from "../../api/requests/MainChannel";
import { incChannelMessage } from "../../api/requests/Member";
import { MainChannel } from "../../api/Schema";
import Event from "../Event";

export default class MessageCreate extends Event {
    
    public name: string = "messageCreate";

    public async execute(message: Msg) : Promise<void> {
        if(message.author.bot) return;

        // Increment member message count :
        const channels = (await request<{ channels: MainChannel[] }>(getChannels)).channels;

        if(channels.find(channel => channel.channelId === message.channelId)){
            request(incChannelMessage, { id: message.author.id, channelId: message.channelId });
        }
    }
}