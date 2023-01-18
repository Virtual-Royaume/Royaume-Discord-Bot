import { msg } from "$core/utils/Message";
import { ChannelType, ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandNumberOption } from "discord.js";
import { simpleEmbed } from "$core/utils/Embed";
import Command from "$core/commands/Command";
import Logger from "$core/utils/Logger";

export default class Clean extends Command {

  public readonly enabledInDev = true;

  public readonly slashCommand = new SlashCommandBuilder()
    .setName(msg("cmd-clean-builder-name"))
    .setDescription(msg("cmd-clean-builder-description"))
    .setDefaultMemberPermissions(0)
    .addNumberOption(new SlashCommandNumberOption()
      .setName(msg("cmd-clean-builder-number-name"))
      .setDescription(msg("cmd-clean-builder-number-description"))
      .setMinValue(1)
      .setMaxValue(100));

  public async execute(command: ChatInputCommandInteraction) : Promise<void> {
    const number = command.options.getNumber("nombre") ?? 10;

    if (command.channel?.type !== ChannelType.GuildText) {
      command.reply({ embeds: [simpleEmbed(msg("cmd-clean-exec-need-textchannel"), "error")], ephemeral: true });
      return;
    }

    try {
      await command.channel.bulkDelete(number);
      command.reply({ embeds: [simpleEmbed(msg("cmd-clean-exec-cleaned", [number]))], ephemeral: true });
    } catch (e) {
      Logger.error(`Error while bulk deleting in a channel : ${e}`);
    }
  }

}