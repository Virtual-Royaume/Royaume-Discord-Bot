import { setAlwaysOnServer } from "$core/api/requests/member";
import { client } from "$core/client";
import { guilds } from "$core/configs/guild";
import { getGuildMembers } from "$core/utils/discord/guild";
import type { EventExecute, EventName } from "$core/utils/handler/event";
import { logger } from "$core/utils/logger";
import { gqlRequest } from "$core/utils/request";
import { userWithId } from "$core/utils/user";

export const event: EventName = "guildMemberRemove";

export const execute: EventExecute<"guildMemberRemove"> = async(member) => {
  if (member.user.bot) return;

  const pro = await client.guilds.fetch(guilds.pro.guildId);
  const game = await client.guilds.fetch(guilds.game.guildId);

  if ((await getGuildMembers(pro))?.find(m => m.id === member.id) || (await getGuildMembers(game))?.find(m => m.id === member.id)) return;

  gqlRequest(setAlwaysOnServer, {
    id: member.id,
    value: false
  });

  logger.info(`Member ${userWithId(member.user)} removed from always on server (left the server)`);
};