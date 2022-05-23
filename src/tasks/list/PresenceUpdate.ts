import Client from "../../Client";
import presenceMessages from "../../../resources/config/presence-messages.json";
import Task from "../Task";
import { ActivityTypes } from "discord.js/typings/enums";
import { ExcludeEnum } from "discord.js";

interface PresenceMessage {
    text: string;
    type: ExcludeEnum<typeof ActivityTypes, "CUSTOM" | "STREAMING">;
}

export default class PresenceUpdate extends Task {

    constructor(){
        super(10_000);
    }

    public async run() : Promise<void> {
        const message = <PresenceMessage>presenceMessages[
            Math.floor(Math.random() * presenceMessages.length)
        ];

        Client.instance.user?.setActivity(message.text, { type: message.type });
    }
}