import Client from "$core/Client";
import Task from "$core/tasks/Task";
import { request } from "$core/api/Request";
import { GetPresenceMessagesType, getPresenceMessages } from "$core/api/requests/PresenceMessage";
import { ActivityType } from "discord.js";

const activityType: Record<string, ActivityType> = {
    "COMPETING": ActivityType.Competing,
    "LISTENING": ActivityType.Listening,
    "PLAYING": ActivityType.Playing,
    "WATCHING": ActivityType.Watching
};

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

        Client.instance.user?.setActivity({ name: message.text, type: activityType[message.type] });
    }
}