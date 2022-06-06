import Client from "../../Client";
import Task from "../Task";
import { request } from "../../api/Request";
import { GetPresenceMessagesType, getPresenceMessages } from "../../api/requests/PresenceMessage";

export default class PresenceUpdate extends Task {

    constructor() {
        super(10_000);
    }

    public async run() : Promise<void> {
        const presenceMessages = (await request<GetPresenceMessagesType>(getPresenceMessages))
            .presenceMessages;

        const message = presenceMessages[
            Math.floor(Math.random() * presenceMessages.length)
        ];

        Client.instance.user?.setActivity(message.text, { type: message.type });
    }
}