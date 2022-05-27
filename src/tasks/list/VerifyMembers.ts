import { request } from "../../api/Request";
import { getMember, setAlwaysOnServer } from "../../api/requests/Member";
import { Member } from "../../api/Schema";
import Client from "../../Client";
import Task from "../Task";

export default class ServerActivityUpdate extends Task {

    constructor(){
        super(10 * 60 * 1000);
    }

    public async run(): Promise<void> {
        
        const guild = await Client.instance.getGuild();
        const members = await guild.members.fetch();

        members.each(async member => {

            const apiMember = (await request<{ member: Member }>(getMember, { id: member.id })).member;

            if(apiMember.isOnServer) return;

            request(setAlwaysOnServer, { id: member.id, value: true });
        });
    }
}