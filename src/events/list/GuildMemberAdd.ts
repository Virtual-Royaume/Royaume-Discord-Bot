import {ChannelType, GuildMember } from "discord.js";
import Client from "$core/Client";
import Event, { EventName } from "$core/events/Event";
import { verify, privateMode, generalChannel, tiers as configTiers } from "$resources/config/information.json";
import { createMember, CreateMemberType, CreateMemberVariables, getMemberActivityTier, GetMemberActivityTierType, GetMemberActivityTierVariables } from "$core/api/requests/Member";
import { gqlRequest } from "$core/utils/Request";
import { simpleEmbed } from "$core/utils/Embed";
import { msg } from "$core/utils/Message";

export default class GuildMemberAdd extends Event {

    public name: EventName = "guildMemberAdd";

    public async execute(member: GuildMember): Promise<void> {
        if (member.user.bot) return;

        // Add verification role :
        if (privateMode) {
            const role = await (await Client.instance.getGuild()).roles.fetch(verify.roles.waiting);

            if (role) member.roles.add(role);
        } else {
            const guild = await Client.instance.getGuild();
            const channel = await guild.channels.fetch(generalChannel);

            if (channel?.type === ChannelType.GuildText) {
                channel.send({ embeds: [simpleEmbed(msg("event-guildmemberadd-welcome"), "normal")] });
            }

            const tier = await gqlRequest<GetMemberActivityTierType, GetMemberActivityTierVariables>(getMemberActivityTier, {
                memberId: member.id
            });

            if (!tier.data?.member.activity.tier) return;

            const tiers: Record<string, string> = configTiers;

            member.roles.add(tiers[tier.data?.member.activity.tier.toString()]);
        }


        // Create the member if he dosen't exist :
        const result = await gqlRequest<CreateMemberType, CreateMemberVariables>(createMember, {
            id: member.id,
            username: member.user.username,
            profilePicture: member.user.avatarURL() ?? "https://i.ytimg.com/vi/Ug9Xh-xNecM/maxresdefault.jpg"
        });

        // if (!result.data?.createMember._id) gqlRequest(setAlwaysOnServer, { id: member.id, value: true });
    }
}