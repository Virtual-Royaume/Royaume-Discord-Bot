import { setAlwaysOnServer } from "$core/api/requests/member";
import { client } from "$core/client";
import { guilds } from "$core/configs/guild";
import { EventExecute, EventName } from "$core/utils/handler/event";
import { gqlRequest } from "$core/utils/request";

export const event: EventName = "guildMemberRemove";

export const execute: EventExecute<"guildMemberRemove"> = async(member) => {
  if (member.user.bot) return;

  const pro = await client.guilds.fetch(guilds.pro.guildId);
  const game = await client.guilds.fetch(guilds.game.guildId);

  if ((await pro.members.fetch()).find(m => m.id === member.id) || (await game.members.fetch()).find(m => m.id === member.id)) return;

  gqlRequest(setAlwaysOnServer, {
    id: member.id,
    value: false
  });
};