import { DMChannel, GuildChannel } from "discord.js";
import Event, { EventName } from "$core/events/Event";
import { getChannels, GetChannelsType, removeChannel } from "$core/api/requests/MainChannel";
import { gqlRequest } from "$core/utils/Request";

export default class ChannelDelete extends Event {

    public name: EventName = "channelDelete";

    public async execute(channel: DMChannel | GuildChannel): Promise<void> {
        const channels = (await gqlRequest<GetChannelsType, undefined>(getChannels)).data?.channels;

        if (!channels) return;

        if (channels.find(c => c.channelId === channel.id)) gqlRequest(removeChannel, { channelId: channel.id });
    }
}