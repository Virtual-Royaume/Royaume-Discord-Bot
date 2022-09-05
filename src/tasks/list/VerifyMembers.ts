import { request } from "$core/api/Request";
import {
    createMember, getMembersOnServerStatus,
    GetMembersOnServerStatusType, setAlwaysOnServer,
    SetAlwaysOnServerType
} from "$core/api/requests/Member";
import Client from "$core/Client";
import Logger from "$core/utils/Logger";
import Task from "$core/tasks/Task";

export default class VerifyMembers extends Task {

    constructor() {
        super(1000 * 60 * 3);
    }

    public async run(): Promise<void> {
        const realMembers = await (await Client.instance.getGuild()).members.fetch();
        const apiMembers = (await request<GetMembersOnServerStatusType>(getMembersOnServerStatus)).members;

        for (const apiMember of apiMembers) {
            const realMember = realMembers.get(apiMember._id);

            if (realMember && !realMember.user.bot) {
                realMembers.delete(apiMember._id);
                continue;
            }

            // Remove members :
            Logger.info(`Fix ${apiMember._id} isOnServer value to false (${apiMember.username})`);
            request(setAlwaysOnServer, { id: apiMember._id, value: false });
        }

        for (const realMember of realMembers.values()) {
            if (realMember.user.bot) continue;

            // Add member :
            Logger.info(`Fix ${realMember.id} isOnServer value to true (${realMember.displayName})`);

            const response = await request<SetAlwaysOnServerType>(
                setAlwaysOnServer, { id: realMember.id, value: true }
            );

            // Create member if he does not exist :
            if (!response.updateMember) await request(createMember, {
                id: realMember.id,
                username: realMember.displayName,
                profilePicture: realMember.avatarURL({ dynamic: true }) ?? "https://i.ytimg.com/vi/Ug9Xh-xNecM/maxresdefault.jpg"
            });
        }
    }
}