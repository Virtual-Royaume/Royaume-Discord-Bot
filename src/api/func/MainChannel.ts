import { getChannels, GetChannelsType } from "$core/api/requests/MainChannel";
import { gqlRequest } from "$core/utils/Request";

type ChannelsByCategory = {
    [category: string]: string[]
}

export async function getChannelsByCategory(): Promise<ChannelsByCategory> {
    // Get mains channels :
    const channels = (await gqlRequest<GetChannelsType, undefined>(getChannels)).data?.channels;

    // Sort channels by category :
    const channelsIdsByCategory: ChannelsByCategory = {};

    if (!channels) return channelsIdsByCategory;

    for (const channel of channels) {
        if (!channelsIdsByCategory[channel.category]) channelsIdsByCategory[channel.category] = [];

        channelsIdsByCategory[channel.category].push(channel.channelId);
    }

    return channelsIdsByCategory;
}