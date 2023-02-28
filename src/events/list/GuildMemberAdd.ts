import { ChannelType, GuildMember } from "discord.js";
import Client from "$core/Client";
import Event, { EventName } from "$core/events/Event";
import { verify, privateMode, generalChannel, tiers as configTiers } from "$resources/config/information.json";
import { createMember, getMemberActivityTier, setAlwaysOnServer } from "$core/api/requests/Member";
import { gqlRequest } from "$core/utils/request";
import { simpleEmbed } from "$core/utils/Embed";
import { msg } from "$core/utils/Message";
import Logger from "$core/utils/Logger";

export default class GuildMemberAdd extends Event {

  public readonly enabledInDev = false;

  public name: EventName = "guildMemberAdd";

  public async execute(member: GuildMember): Promise<void> {
    if (member.user.bot) return;

    // Create the member if he doesn't exist :
    const response = await gqlRequest(createMember, {
      id: member.id,
      username: member.user.username,
      profilePicture: member.user.avatarURL() ?? "https://i.ytimg.com/vi/Ug9Xh-xNecM/maxresdefault.jpg"
    });

    if (response.success && !response.data.createMember) gqlRequest(setAlwaysOnServer, { id: member.id, value: true });

    // Add verification role :
    if (privateMode) {
      const role = await (await Client.instance.getGuild()).roles.fetch(verify.roles.waiting);

      try {
        if (role) member.roles.add(role);
      } catch (e) {
        Logger.error(`Error while updating member ${member?.user.id} roles : ${e}`);
      }
      return;
    }

    const guild = await Client.instance.getGuild();
    const channel = await guild.channels.fetch(generalChannel);

    if (channel?.type === ChannelType.GuildText) {
      const clientId = Client.instance.user?.id;
      const embed = simpleEmbed(msg("event-guildmemberadd-welcome-message", [clientId ?? ""])); // TODO : error if undefined ID
      const embeds = [];

      try {
        await member.send({ embeds: [embed] });
      } catch (error) {
        embeds.push(embed);
      }

      (await channel.send({ content: msg("event-guildmemberadd-welcome", [member.id]), embeds })).react("👋");
    }

    const tierQuery = await gqlRequest(getMemberActivityTier, {
      memberId: member.id
    });

    if (!tierQuery.success || !tierQuery.data.member) return;

    const tiers: Record<string, string> = configTiers;

    if (tierQuery.data.member.activity.tier) {
      try {
        member.roles.add(tiers[tierQuery.data.member.activity.tier.toString()]);
      } catch (e) {
        Logger.error(`Error while updating member ${member?.user.id} roles : ${e}`);
      }
    }
  }

}