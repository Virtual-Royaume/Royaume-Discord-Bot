import type { ChannelsByCategory } from "./channel.type";
import type { GetChannelsQuery } from "#/utils/request";
import type { Result } from "rustic-error";
import { error } from "rustic-error";
import { ok } from "rustic-error";
import { getChannels } from "./channel.gql";
import { gqlRequest } from "#/utils/request";

export const getChannelsAsArray = async(): Promise<Result<GetChannelsQuery["channels"], Error>> => {
  const response = await gqlRequest(getChannels);

  if (!response.ok) return error(Error("Unable to fetch the channel list"));

  return ok(response.value.channels);
};

export const getChannelsByCategory = async(): Promise<Result<ChannelsByCategory, Error>> => {
  // Get mains channels :
  const channels = await getChannelsAsArray();

  if (!channels.ok) return error(channels.error);

  // Sort channels by category :
  const channelsIdsByCategory: ChannelsByCategory = {};

  for (const channel of channels.value) {
    if (!channelsIdsByCategory[channel.category]) channelsIdsByCategory[channel.category] = [];

    channelsIdsByCategory[channel.category].push(channel.channelId);
  }

  return ok(channelsIdsByCategory);
};