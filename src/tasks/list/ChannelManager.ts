import Client from "$core/Client";
import Task from "$core/tasks/Task";
import { isDevEnvironment, isProdEnvironment } from "$core/utils/Environment";
import { voiceChannels } from "$resources/config/information.json";
import { ChannelType, Collection, VoiceChannel } from "discord.js";

type ChannelVisibility = "public" | "private";

export default class ChannelManager extends Task {

  constructor() {
    super(5_000);

    if (isProdEnvironment) this.createDefaultChannels();
  }

  private async createDefaultChannels() : Promise<void> {
    const channels = await (await Client.instance.getGuild()).channels.fetch();

    for (const channelName of voiceChannels.public.nameList.slice(0, voiceChannels.public.defaultCount).reverse()) {
      if (!channels.find(channel => channel?.name === channelName)) this.createChannel(channelName, "public");
    }
  }

  public async run() : Promise<void> {
    if (isDevEnvironment) return;

    // Creation of new voice channels if they are all full :
    if (!(await this.getEmptyChannels(voiceChannels.public.nameList)).size) {
      const channelToCreate = await this.getAvailablePublicChannel();

      if (channelToCreate) await this.createChannel(channelToCreate, "public");
    }

    if (!(await this.getEmptyChannels(voiceChannels.private.name)).size) {
      await this.createChannel(voiceChannels.private.name, "private");
    }

    // Deletion of unoccupied extra rooms :
    const channels = Array.from((await this.getEmptyChannels(voiceChannels.public.nameList)).values());

    if (channels.length > 1) {
      const defaultChannels = channels.filter(c => {
        return voiceChannels.public.nameList.slice(0, voiceChannels.public.defaultCount).includes(c.name);
      });

      if (defaultChannels.length) {
        for (const channel of channels.filter(c => !defaultChannels.find(dc => dc.name === c.name))) await channel.delete();
      } else {
        for (const channel of channels.slice(0, -1)) await channel.delete();
      }
    }

    const privateChannels = Array.from((await this.getEmptyChannels(voiceChannels.private.name)).values()).slice(0, -1);

    for (const channel of privateChannels) await channel.delete();
  }

  /**
     * Create a voice channel in the category defined in the configuration.
     * Define its number of places and its position according to its type (public or private).
     */
  private async createChannel(name: string, type: ChannelVisibility) : Promise<void> {
    const channelPosition = await this.getChannelCount("public") - 1;

    await (await Client.instance.getGuild()).channels.create({
      name: name,
      type: ChannelType.GuildVoice,
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
      return channel.type === ChannelType.GuildVoice
                && channel.parentId === voiceChannels.category
                && !channel.members.size
                && channelsNames.includes(channel.name);
    });
  }

  /**
     * Returns a public voice channel name if there is still one available (not used) in the list defined in the configuration.
     */
  private async getAvailablePublicChannel() : Promise<string | undefined> {
    const channels = (await (await Client.instance.getGuild()).channels.fetch()).filter(channel => {
      return channel?.type === ChannelType.GuildVoice
                && voiceChannels.public.nameList.includes(channel.name);
    }).map(channel => channel?.name);

    return voiceChannels.public.nameList.filter(name => {
      return !channels.includes(name);
    }).shift();
  }

  private async getChannelCount(channelType: ChannelVisibility) : Promise<number> {
    const channelsNames = channelType === "public" ? voiceChannels.public.nameList : voiceChannels.private.name;

    return (await Client.instance.getGuild()).channels.cache.filter(channel => {
      return channel.type === ChannelType.GuildVoice
                && channel.parentId === voiceChannels.category
                && channelsNames.includes(channel.name);
    }).size;
  }
}