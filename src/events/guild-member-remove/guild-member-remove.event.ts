import type { EventExecute, EventName } from "#/utils/handler/event";
import { setAlwaysOnServer } from "#/api/requests/member";
import { client } from "#/client";
import { guilds } from "#/configs/guild";
import { getGuildMembers } from "#/utils/discord/guild";
import { logger } from "#/utils/logger";
import { gqlRequest } from "#/utils/request";
import { userWithId } from "#/utils/discord/user";

export const event: EventName = "guildMemberRemove";

export const execute: EventExecute<"guildMemberRemove"> = async(member) => {
  if (member.user.bot) return;

  const pro = await client.guilds.fetch(guilds.pro.guildId);
  const game = await client.guilds.fetch(guilds.game.guildId);

  if ((await getGuildMembers(pro))?.find(m => m.id === member.id) || (await getGuildMembers(game))?.find(m => m.id === member.id)) return;

  void gqlRequest(setAlwaysOnServer, {
    id: member.id,
    value: false
  });

  logger.info(`Member ${userWithId(member.user)} removed from always on server (left the server)`);
};