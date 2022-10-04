import { DMChannel, GuildChannel } from "discord.js";
import { request } from "$core/api/Request";
import Event, { EventName } from "$core/events/Event";
import { getChannels, GetChannelsType, removeChannel } from "$core/api/requests/MainChannel";

export default class ChannelDelete extends Event {

    public name: EventName = "channelDelete";

    public async execute(channel: DMChannel | GuildChannel): Promise<void> {
        const channels = (await request<GetChannelsType, undefined>(getChannels)).channels;

        if (channels.find(c => c.channelId === channel.id)) request(removeChannel, { channelId: channel.id });
    }
}