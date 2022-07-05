import Client from "../../Client";
import Task from "../Task";

const channelsName = [
    "salon bleu",
    "salon rouge",
    "salon jaune",
    "salon vert",
    "salon violet",
    "salon orange",
    "salon rose",
    "salon turquoise",
    "salon rose",
    "salon noir",
    "salon gris",
    "salon blanc",
    "salon brun",
    "salon marron"
];

export default class ChannelManager extends Task {

    constructor() {
        super(5_000);
    }

    public async run() : Promise<void> {
        this.create();
        this.delete();
    }

    private async create() : Promise<void> {
        const guild = await Client.instance.getGuild();

        const channels = guild.channels.cache.filter(channel => {
            return channelsName.includes(channel.name)
                && channel.type === "GUILD_VOICE"
                && channel.members.size === 0;
        });

        if (channels.size === 0) {
            const channelToCreate = channelsName.filter(name => {
                return !guild.channels.cache.find(channel => channel.name === name);
            }).shift();

            if (channelToCreate) {
                guild.channels.create(channelToCreate, {
                    type: "GUILD_VOICE",
                    parent: "853314658789490709",
                    position: 3
                });
            }
        }
    }

    private async delete() : Promise<void> {
        const channels = (await Client.instance.getGuild()).channels.cache.filter(channel => {
            return !channelsName.slice(0, 3).includes(channel.name)
                && channelsName.includes(channel.name)
                && channel.type === "GUILD_VOICE"
                && channel.members.size === 0;
        }).values();

        for (const channel of channels) {
            channel.delete();
        }
    }
}