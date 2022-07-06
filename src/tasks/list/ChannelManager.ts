import Client from "../../Client";
import Task from "../Task";

import { voiceChannels } from "../../../resources/config/information.json";

export default class ChannelManager extends Task {

    constructor() {
        super(60_000);
    }

    public async run() : Promise<void> {
        this.create();
        this.delete();
    }

    private async create() : Promise<void> {
        // PUBLIC
        const guild = await Client.instance.getGuild();

        const channels = guild.channels.cache.filter(channel => {
            return voiceChannels.channelsNames.includes(channel.name)
                && channel.type === "GUILD_VOICE"
                && channel.members.size === 0;
        });

        if (channels.size === 0) {
            const channelToCreate = voiceChannels.channelsNames.filter(name => {
                return !guild.channels.cache.find(channel => channel.name === name);
            }).shift();

            if (channelToCreate) {
                guild.channels.create(channelToCreate, {
                    type: "GUILD_VOICE",
                    parent: voiceChannels.category,
                    position: voiceChannels.defaultPosition
                });
            }
        }

        // PRIVATE
        const privateChannels = guild.channels.cache.filter(channel => {
            return channel.name == "salon privé"
                && channel.type === "GUILD_VOICE"
                && channel.members.size === 0;
        });

        if (privateChannels.size === 0) {
            guild.channels.create(voiceChannels.privateChannel.name, {
                type: "GUILD_VOICE",
                parent: voiceChannels.category,
                position: voiceChannels.privateChannel.position,
                userLimit: voiceChannels.privateChannel.userLimit
            });
        }
    }

    private async delete() : Promise<void> {
        // PUBLIC
        const channels = (await Client.instance.getGuild()).channels.cache.filter(channel => {
            return !voiceChannels.channelsNames.slice(0, 3).includes(channel.name)
                && voiceChannels.channelsNames.includes(channel.name)
                && channel.type === "GUILD_VOICE"
                && channel.members.size === 0;
        }).values();

        for (const channel of channels) channel.delete();

        // PRIVATE
        const privateChannels = (await Client.instance.getGuild()).channels.cache.filter(channel => {
            return channel.name == voiceChannels.privateChannel.name
                && channel.type === "GUILD_VOICE"
                && channel.members.size === 0;
        }).values();

        for (const privateChannel of privateChannels) privateChannel.delete();
    }
}