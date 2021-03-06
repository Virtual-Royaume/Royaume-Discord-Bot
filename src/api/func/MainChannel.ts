import { request } from "../Request";
import { getChannels, GetChannelsType } from "../requests/MainChannel";

type ChannelsByCategory = {
    [category: string]: string[]
}

export async function getChannelsByCategory() : Promise<ChannelsByCategory> {
    // Get mains channels :
    const channels = (await request<GetChannelsType>(getChannels)).channels;

    // Sort channels by category :
    const channelsIdsByCategory: ChannelsByCategory = {};

    channels.forEach(channel => {
        if (!channelsIdsByCategory[channel.category]) channelsIdsByCategory[channel.category] = [];

        channelsIdsByCategory[channel.category].push(channel.channelId);
    });

    return channelsIdsByCategory;
}