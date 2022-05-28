import { request } from "../../api/Request";
import { getMembers, setAlwaysOnServer } from "../../api/requests/Member";
import { Member } from "../../api/Schema";
import Client from "../../Client";
import Logger from "../../utils/Logger";
import Task from "../Task";

export default class VerifyMembers extends Task {

    constructor(){
        super(10 * 60 * 1000);
    }

    public async run(): Promise<void> {
        const realMembers = await (await Client.instance.getGuild()).members.fetch();
        const apiMembers = (await request<{members: Member[]}>(getMembers)).members;

        for(let apiMember of apiMembers){
            const realMember = realMembers.get(apiMember._id);

            if(realMember && !realMember.user.bot){
                realMembers.delete(apiMember._id);
                continue;
            }
            
            // Remove members :
            Logger.info(`Fix ${apiMember._id} isOnServer value to false (${apiMember.username})`);
            request(setAlwaysOnServer, { id: apiMember._id, value: false });
        }

        for(let realMember of realMembers.values()){
            if(realMember.user.bot) continue;

            // Add member :
            Logger.info(`Fix ${realMember.id} isOnServer value to true (${realMember.displayName})`);
            request(setAlwaysOnServer, { id: realMember.id, value: true });
        }
    }
}