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
            if(realMembers.has(apiMember._id)){
                realMembers.delete(apiMember._id);
                continue;
            }
            
            Logger.info(`Fix ${apiMember.username} (${apiMember._id}) member (isOnServer) value, now on false`);
            request(setAlwaysOnServer, { id: apiMember._id, value: false });
        }

        for(let realMember of realMembers.values()){
            Logger.info(`Fix ${realMember.displayName} (${realMember.id}) member (isOnServer) value, now on true`);
            request(setAlwaysOnServer, { id: realMember.id, value: true });
        }
    }
}