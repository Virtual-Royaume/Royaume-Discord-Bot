import Task from "$core/tasks/Task";
import { tiers as configTiers, verify, generalChannel } from "$resources/config/information.json";
import Client from "$core/Client";
import { request } from "$core/api/Request";
import { getMembersTier, GetMembersTierType } from "$core/api/requests/Member";
import Logger from "$core/utils/Logger";
import { BaseGuildTextChannel } from "discord.js";
import { simpleEmbed } from "$core/utils/Embed";
import { msg } from "$core/utils/Message";

type RoleUpdate = {
    memberId: string;
    oldRole?: string;
    newRole: string;
}

export default class PresenceUpdate extends Task {

    constructor() {
        super(60_000);
    }

    public async run(): Promise<void> {
        const guild = await Client.instance.getGuild();

        const tiers: Record<string, string> = configTiers;

        const discordMembers = await guild.members.fetch();
        const apiMembers = (await request<GetMembersTierType, undefined>(getMembersTier)).members;

        const updates: RoleUpdate[] = [];

        // Check if the member have the right role :
        for (const [id, member] of discordMembers) {
            if (member.user.bot || member.roles.cache.has(verify.roles.waiting)) continue;

            const tierRole = tiers[apiMembers.find(element => element._id === id)?.activity.tier.toString() ?? ""];

            if (!tierRole) return Logger.error(`Undefined role tier for member ${member.id}`);

            const otherRoles = Object.values(tiers).filter(role => role !== tierRole);

            if (!member.roles.cache.has(tierRole) || member.roles.cache.hasAny(...otherRoles)) {
                const oldRole = member.roles.cache.filter(role => otherRoles.includes(role.id)).first()?.id;

                await member.roles.remove(Object.values(tiers));
                member.roles.add(tierRole);

                updates.push({ memberId: id, newRole: tierRole, oldRole: oldRole });
            }
        }

        // Broadcast updates :
        if (!updates.length) return;

        const generalChannelInstance = await guild.channels.fetch(generalChannel);

        if (!(generalChannelInstance instanceof BaseGuildTextChannel)) return;

        let message = "";

        for (const tierRole of Object.values(tiers)) {
            const tierMembers = updates.filter(element => element.newRole === tierRole);

            if (tierMembers.length) {
                message += tierMembers.map(element => {
                    if (!element.oldRole) return msg("task-tierupdate-exec-embed-member-no-old-rank-update", [element.memberId, element.newRole]);
                    else return msg("task-tierupdate-exec-embed-member-rank-update", [element.memberId, element.oldRole, element.newRole]);
                }).join("\n");

                message += "\n\n";
            }
        }

        generalChannelInstance.send({
            embeds: [simpleEmbed(message, "normal", msg("task-tierupdate-exec-embed-title"))]
        });
    }
}