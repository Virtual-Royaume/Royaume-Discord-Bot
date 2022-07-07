import Client from "../../Client";
import Task from "../Task";
import { voiceChannels } from "../../../resources/config/information.json";
import { Collection, VoiceChannel } from "discord.js";

type ChannelType = "public" | "private";

export default class ChannelManager extends Task {

    constructor() {
        super(60_000);

        // TODO : createDefaultChannels()
    }

    public async run() : Promise<void> {
        // Creation of new voice channels if they are all full :
        if (!(await this.getEmptyChannels(voiceChannels.public.nameList)).size) {
            const channelToCreate = await this.getAvailablePublicChannel();

            if (channelToCreate) this.createChannel(channelToCreate, "public");
        }

        if (!(await this.getEmptyChannels(voiceChannels.private.name)).size) {
            this.createChannel(voiceChannels.private.name, "private");
        }

        // Deletion of unoccupied extra rooms :
        const channels = Array.from(
            (await this.getEmptyChannels(voiceChannels.public.nameList.slice(voiceChannels.public.defaultCount))).values()
        ).splice(-1);
        const privateChannels = Array.from((await this.getEmptyChannels(voiceChannels.private.name)).values()).splice(-1);

        for (const channel of [...channels, ...privateChannels]) channel.delete();
    }

    /**
     * Create a voice channel in the category defined in the configuration.
     * Define its number of places and its position according to its type (public or private).
     */
    private async createChannel(name: string, type: ChannelType) : Promise<void> {
        const channelPosition = await this.getChannelCount("public") + 1;

        (await Client.instance.getGuild()).channels.create(name, {
            type: "GUILD_VOICE",
            parent: voiceChannels.category,
            position: type === "public" ? channelPosition : channelPosition + await this.getChannelCount("private"),
            userLimit: type === "private" ? 2 : undefined
        });
    }

    /**
     * This function allows you to obtain a list of voice channel that respects the desired name(s) and that does not contain any member.
     * @param channelsNames desired name(s)
     */
    private async getEmptyChannels(channelsNames: string | string[]) : Promise<Collection<string, VoiceChannel>> {
        return (await Client.instance.getGuild()).channels.cache.filter((channel): channel is VoiceChannel => {
            return channel.type === "GUILD_VOICE"
                && channel.parentId === voiceChannels.category
                && !channel.members.size
                && channelsNames.includes(channel.name);
        });
    }

    /**
     * Returns a public voice channel name if there is still one available (not used) in the list defined in the configuration.
     */
    private async getAvailablePublicChannel() : Promise<string | undefined> {
        return voiceChannels.public.nameList.filter(async name => {
            return !(await Client.instance.getGuild()).channels.cache.find(channel => channel.name === name);
        }).shift();
    }

    private async getChannelCount(channelType: ChannelType) : Promise<number> {
        const channelsNames = channelType === "public" ? voiceChannels.public.nameList : voiceChannels.private.name;

        return (await Client.instance.getGuild()).channels.cache.filter(channel => {
            return channel.type === "GUILD_VOICE"
                && channel.parentId === voiceChannels.category
                && channelsNames.includes(channel.name)
        }).size;
    }
}