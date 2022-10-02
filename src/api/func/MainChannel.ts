import { request } from "$core/api/Request";
import { getChannels, GetChannelsType } from "$core/api/requests/MainChannel";

type ChannelsByCategory = {
    [category: string]: string[]
}

export async function getChannelsByCategory() : Promise<ChannelsByCategory> {
    // Get mains channels :
    const channels = (await request<GetChannelsType, undefined>(getChannels)).channels;

    // Sort channels by category :
    const channelsIdsByCategory: ChannelsByCategory = {};

    for (const channel of channels) {
        if (!channelsIdsByCategory[channel.category]) channelsIdsByCategory[channel.category] = [];

        channelsIdsByCategory[channel.category].push(channel.channelId);
    }

    return channelsIdsByCategory;
}