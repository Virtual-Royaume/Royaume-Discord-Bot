import Task from "../Task";
import { tiers as configTiers, verify, generalChannel } from "../../../resources/config/information.json";
import Client from "../../Client";
import { request } from "../../api/Request";
import { getMembersTier, GetMembersTierType } from "../../api/requests/Member";
import Logger from "../../utils/Logger";
import { BaseGuildTextChannel } from "discord.js";
import { simpleEmbed } from "../../utils/Embed";

interface RoleUpdate {
    memberId: string;
    newRole: string;
}

export default class PresenceUpdate extends Task {

    constructor() {
        super(60_000);
    }

    public async run() : Promise<void> {
        const tiers: { [key: string]: string } = configTiers;

        const discordMembers = await (await Client.instance.getGuild()).members.fetch();
        const apiMembers = (await request<GetMembersTierType>(getMembersTier)).members;

        const updates: RoleUpdate[] = [];

        for (const [id, member] of discordMembers) {
            if (member.user.bot || member.roles.cache.has(verify.roles.waiting)) continue;

            const tierRole = tiers[apiMembers.find(element => element._id === id)?.activity.tier.toString() ?? ""];

            if (!tierRole) return Logger.error(`Undefined role tier for member ${member.id}`);

            const otherRoles = Object.values(tiers).filter(role => role !== tierRole);

            if (!member.roles.cache.has(tierRole) || member.roles.cache.hasAny(...otherRoles)) {
                await member.roles.remove(Object.values(tiers));
                member.roles.add(tierRole);

                updates.push({ memberId: id, newRole: tierRole });
            }
        }

        // Broadcast updates :
        if (!updates.length) return;

        const generalChannelInstance = await (await Client.instance.getGuild()).channels.fetch(generalChannel);

        if (!(generalChannelInstance instanceof BaseGuildTextChannel)) return;

        const message = updates.map(element => `<@${element.memberId}> ▶️ <@&${element.newRole}>`).join("\n");

        generalChannelInstance.send({
            embeds: [simpleEmbed(message, "normal", "Changement des rôles d'activités")]
        });
    }
}