import Client from "../../Client";
import presenceUpdate from "../../../resources/config/presence-update-messages.json";
import Task from "../Task";
import { ActivityTypes } from "discord.js/typings/enums";
import { ExcludeEnum } from "discord.js";

interface PresenceUpdateType{
    text: string;
    type: ExcludeEnum<typeof ActivityTypes, 'CUSTOM'>;
}

export default class PresenceUpdate extends Task {

    constructor(){
        super(10_000);
    }

    public async run() : Promise<void> {
        const presence:PresenceUpdateType[] = <PresenceUpdateType[]>presenceUpdate
        const rdm = Math.floor(Math.random() * presence.length);

        Client.instance.user?.setActivity(presence[rdm].text, { type: presence[rdm].type });
    }
}