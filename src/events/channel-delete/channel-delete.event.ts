import type { EventExecute, EventName } from "#/utils/handler/event";
import { guilds } from "#/configs/guild";
import { logger } from "#/utils/logger";
import { gqlRequest } from "#/utils/request";
import { GuildChannel, TextChannel } from "discord.js";
import { removeChannel } from "./channel-delete.gql";
import { getChannelsAsArray } from "#/utils/api/channel/channel.util";

export const event: EventName = "channelDelete";

export const execute: EventExecute<"channelDelete"> = async(channel) => {
  if (channel instanceof GuildChannel && channel.guildId !== guilds.pro.guildId) return;

  const channelsQuery = await getChannelsAsArray();

  if (!channelsQuery.ok) return;

  if (channelsQuery.value.find(c => c.channelId === channel.id)) void gqlRequest(removeChannel, { channelId: channel.id });

  if (!(channel instanceof TextChannel)) return;
  logger.info(`Channel #${channel.name} (${channel.id}) deleted`);
};