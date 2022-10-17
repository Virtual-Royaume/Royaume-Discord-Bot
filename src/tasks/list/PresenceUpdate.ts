import Client from "$core/Client";
import Task from "$core/tasks/Task";
import { getPresenceMessages } from "$core/api/requests/PresenceMessage";
import { ActivityType } from "discord.js";
import { gqlRequest } from "$core/utils/request";

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

    public async run(): Promise<void> {
        const presenceMessages = (await gqlRequest(getPresenceMessages)).data?.presenceMessages;

        if (!presenceMessages) return;

        const message = presenceMessages[Math.floor(Math.random() * presenceMessages.length)];

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        Client.instance.user?.setActivity({ name: message.text, type: activityType[message.type] });
    }
}