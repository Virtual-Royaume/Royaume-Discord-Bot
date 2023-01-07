import { ChannelType, ChatInputCommandInteraction, GuildMember, SlashCommandBuilder } from "discord.js";
import Client from "$core/Client";
import Command from "$core/commands/Command";
import { youtubeTogether } from "$resources/config/app-integration.json";
import { generalChannel } from "$resources/config/information.json";
import { msg } from "$core/utils/Message";
import { simpleEmbed } from "$core/utils/Embed";

export default class WatchTogether extends Command {

  public readonly enabledInDev = true;

  public readonly slashCommand = new SlashCommandBuilder()
    .setName(msg("cmd-together-builder-name"))
    .setDescription(msg("cmd-together-builder-description"));

  public async execute(command: ChatInputCommandInteraction): Promise<void> {
    if (!(command.member instanceof GuildMember)) {
      command.reply({ embeds: [simpleEmbed(msg("message-execution-error-cmd"), "error")], ephemeral: true });
      return;
    }

    if (!command.member.voice.channelId) {
      command.reply({ embeds: [simpleEmbed(msg("cmd-together-exec-voice-needed"), "error")], ephemeral: true });
      return;
    }

    const generalTextChannel = await (await Client.instance.getGuild()).channels.fetch(generalChannel);

    if (generalTextChannel?.type !== ChannelType.GuildText) return;

    const channel = await Client.instance.channels.fetch(command.member.voice.channelId);

    if (channel?.type !== ChannelType.GuildVoice) {
      command.reply({ embeds: [simpleEmbed(msg("cmd-together-exec-voice-needed"), "error")], ephemeral: true });
      return;
    }

    const invite = await channel.createInvite({
      temporary: true,
      maxAge: 86_400,
      maxUses: 0,
      unique: true,
      targetType: 2,
      targetApplication: youtubeTogether
    });

    command.reply({
      embeds: [simpleEmbed(msg("cmd-together-exec", [invite.code]))],
      ephemeral: true
    });

    generalTextChannel.send({
      embeds: [simpleEmbed(msg("cmd-together-exec-general", [command.user.id, invite.code]))]
    });
  }

}