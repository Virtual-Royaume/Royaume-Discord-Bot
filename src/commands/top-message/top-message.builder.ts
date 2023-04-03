import { commands } from "$core/configs/message/command";
import { SlashCommandDefition } from "$core/utils/handler/command";
import { ChannelType, SlashCommandBuilder } from "discord.js";

export const slashCommand: SlashCommandDefition = new SlashCommandBuilder()
  .setName(commands.topMessage.name)
  .setDescription(commands.topMessage.description)

// Total
  .addSubcommand(subCommand => subCommand
    .setName(commands.topMessage.subcmds.total.name)
    .setDescription(commands.topMessage.subcmds.total.description)
    .addNumberOption(numberOption => numberOption
      .setName(commands.topMessage.subcmds.total.options.page.name)
      .setDescription(commands.topMessage.subcmds.total.options.page.description)
      .setMinValue(1)))

  // Month
  .addSubcommand(subCommand => subCommand
    .setName(commands.topMessage.subcmds.month.name)
    .setDescription(commands.topMessage.subcmds.month.description)
    .addNumberOption(numberOption => numberOption
      .setName(commands.topMessage.subcmds.month.options.page.name)
      .setDescription(commands.topMessage.subcmds.month.options.page.description)
      .setMinValue(1)))

  // Channel
  .addSubcommand(subCommand => subCommand
    .setName(commands.topMessage.subcmds.channel.name)
    .setDescription(commands.topMessage.subcmds.channel.description)
    .addChannelOption(channelOption => channelOption
      .setName(commands.topMessage.subcmds.channel.options.channel.name)
      .setDescription(commands.topMessage.subcmds.channel.options.channel.description)
      .addChannelTypes(ChannelType.GuildText)
      .setRequired(true))
    .addNumberOption(numberOption => numberOption
      .setName(commands.topMessage.subcmds.channel.options.page.name)
      .setDescription(commands.topMessage.subcmds.channel.options.page.description)
      .setMinValue(1)));