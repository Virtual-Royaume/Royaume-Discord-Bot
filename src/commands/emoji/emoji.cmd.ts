import { StopReason, maxEmojiByGuildTier } from "$core/commands/emoji/emoji.util";
import { simpleEmbed } from "$core/utils/embed";
import { CommandExecute } from "$core/utils/handler/command";
import { msgParams } from "$core/utils/message";
import { commands } from "$core/configs/message/command";
import { AttachmentBuilder, BaseGuildTextChannel } from "discord.js";
import { proposals } from "$core/configs";
import { logger } from "$core/utils/logger";
import { getGuildTypeById, guilds } from "$core/configs/guild";

export const execute: CommandExecute = async(command) => {
  const guild = command.guild;

  if (!guild) {
    command.reply({
      embeds: [simpleEmbed(commands.emoji.exec.isntInGuild, "error")],
      ephemeral: true
    });
    return;
  }

  const guildType = getGuildTypeById(guild.id);

  if (!guildType) {
    command.reply({
      embeds: [simpleEmbed(commands.emoji.exec.isntInOfficialGuild, "error")],
      ephemeral: true
    });
    return;
  }

  const maxEmoji = maxEmojiByGuildTier[guild.premiumTier];

  if (guild.emojis.cache.size >= maxEmoji) {
    command.reply({
      embeds: [simpleEmbed(commands.emoji.exec.emojiLimit, "error")],
      ephemeral: true
    });
    return;
  }

  const generalChannel = await guild.channels.fetch(guilds[guildType].channels.general);

  if (!generalChannel) {
    command.reply({
      embeds: [simpleEmbed(commands.emoji.exec.generalChannelDoesntExist, "error")],
      ephemeral: true
    });
    return;
  }

  if (!(generalChannel instanceof BaseGuildTextChannel)) {
    command.reply({
      embeds: [simpleEmbed(commands.emoji.exec.generalChannelIsntText, "error")],
      ephemeral: true
    });
    return;
  }

  const emojiId = command.options.getString(commands.emoji.options.name.name, true);

  if (guild.emojis.cache.find(emoji => emoji.name == emojiId)) {
    command.reply({
      embeds: [simpleEmbed(msgParams(commands.emoji.exec.emojiAlreadyExist, [emojiId]), "error")],
      ephemeral: true
    });
    return;
  }

  const attachment = command.options.getAttachment(commands.emoji.options.emoji.name, true);

  // Send the vote message :
  const voteMessage = await generalChannel.send({
    files: [new AttachmentBuilder(attachment.url, { name: "image.png" })],
    embeds: [simpleEmbed(
      msgParams(commands.emoji.exec.pollEmbed.content, [emojiId, command.user.id]),
      "normal",
      commands.emoji.exec.pollEmbed.title
    )]
  });

  await voteMessage.react(proposals.emoji.upVote.emoji);
  await voteMessage.react(proposals.emoji.downVote.emoji);

  command.reply({
    embeds: [simpleEmbed(msgParams(commands.emoji.exec.pollSent, [generalChannel.id]))],
    ephemeral: true
  });

  const reactionCollector = voteMessage.createReactionCollector({
    filter: (reaction, user) => {
      return (
        reaction.emoji.name === proposals.emoji.upVote.emoji || reaction.emoji.name === proposals.emoji.downVote.emoji
      ) && user.id !== command.user.id;
    },
    time: 1000 * 60 * 20
  });

  reactionCollector.on("collect", (reaction) => {
    if (reaction.emoji.name === proposals.emoji.upVote.emoji && reaction.count >= proposals.emoji.upVote.count) {
      return reactionCollector.stop(StopReason.ACCEPTED);
    }

    if (reaction.count >= proposals.emoji.downVote.count) {
      return reactionCollector.stop(StopReason.REFUSED);
    }
  });

  reactionCollector.on("end", (_, reason) => {
    if (reason === StopReason.MESSAGE_DELETED) return;

    switch (reason) {
      case StopReason.TIME: {
        voteMessage.reply({
          embeds: [simpleEmbed(commands.emoji.exec.pollTimeout)]
        });
        break;
      }

      case StopReason.ACCEPTED: {
        try {
          guild.emojis.create({ attachment: attachment?.url, name: emojiId });
          voteMessage.reply({
            embeds: [simpleEmbed(commands.emoji.exec.pollAccepted)]
          });
        } catch (e) {
          logger.error(`Error while adding emoji : ${e}`);
        }
        break;
      }

      case StopReason.REFUSED: {
        voteMessage.reply({
          embeds: [simpleEmbed(commands.emoji.exec.pollRefused)]
        });
        break;
      }
    }

    voteMessage.reactions.removeAll();
  });
};