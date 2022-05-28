import { request } from "../../api/Request";
import { getMembers, setAlwaysOnServer } from "../../api/requests/Member";
import Client from "../../Client";
import Task from "../Task";

export default class VerifyMembers extends Task {

    constructor(){
        super(10 * 60 * 1000);
    }

    public async run(): Promise<void> {
        
        const members = await (await Client.instance.getGuild()).members.fetch();
        const apiMembers = (await request<{members: {id: string, isOnServer: boolean}[]}>(getMembers)).members;

        apiMembers.forEach((member, index) => {

            if(members.has(member.id)){
                members.delete(member.id);
                return;
            }

            request(setAlwaysOnServer, { id: member.id, value: false });
        });

        members.each(member => {
            request(setAlwaysOnServer, { id: member.id, value: true });
        });
    }
}