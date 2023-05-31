import type { EventExecute, EventName } from "$core/utils/handler/event";
import { getChannels, removeChannel } from "$core/api/requests/main-channel";
import { guilds } from "$core/configs/guild";
import { logger } from "$core/utils/logger";
import { gqlRequest } from "$core/utils/request";
import { GuildChannel, TextChannel } from "discord.js";

export const event: EventName = "channelDelete";

export const execute: EventExecute<"channelDelete"> = async(channel) => {
  if (channel instanceof GuildChannel && channel.guildId !== guilds.pro.guildId) return;

  const channelsQuery = await gqlRequest(getChannels);

  if (!channelsQuery.ok) return;

  if (channelsQuery.value.channels.find(c => c.channelId === channel.id)) void gqlRequest(removeChannel, { channelId: channel.id });

  if (!(channel instanceof TextChannel)) return;
  logger.info(`Channel #${channel.name} (${channel.id}) deleted`);
};