import { SlashCommandDefition } from "$core/utils/handler/command";
import { SlashCommandBuilder } from "discord.js";
import { commands } from "$core/configs/message/command";

export const slashCommand: SlashCommandDefition = new SlashCommandBuilder()
  .setName(commands.emoji.name)
  .setDescription(commands.emoji.description)
  .addAttachmentOption(attachmentOption => attachmentOption
    .setName(commands.emoji.options.emoji.name)
    .setDescription(commands.emoji.options.emoji.description)
    .setRequired(true))
  .addStringOption(stringOption => stringOption
    .setName(commands.emoji.options.name.name)
    .setDescription(commands.emoji.options.name.description)
    .setRequired(true));