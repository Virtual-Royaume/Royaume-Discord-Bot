import { getGuild } from "$core/client";
import { StopReason, maxEmojiByGuildTier } from "$core/commands/emoji/emoji.util";
import { simpleEmbed } from "$core/utils/embed";
import { CommandExecute } from "$core/utils/handler/command";
import { msgParams, multiLineMsg } from "$core/utils/message";
import { generalChannel as generalChannelId } from "$resources/config/information.json";
import { commands } from "$resources/config/messages.json";
import { AttachmentBuilder, BaseGuildTextChannel } from "discord.js";
import { emojiProposal } from "$resources/config/proposal.json";
import { logger } from "$core/utils/logger";

export const execute: CommandExecute = async(command) => {
  const guild = await getGuild();
  const maxEmoji = maxEmojiByGuildTier[guild.premiumTier];

  const generalChannel = await guild.channels.fetch(generalChannelId);

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

  if (guild.emojis.cache.size >= maxEmoji) {
    command.reply({
      embeds: [simpleEmbed(commands.emoji.exec.emojiLimit, "error")],
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
      msgParams(multiLineMsg(commands.emoji.exec.pollEmbed.content), [emojiId, command.user.id]),
      "normal",
      commands.emoji.exec.pollEmbed.title
    )]
  });

  await voteMessage.react(emojiProposal.emoji.upVote);
  await voteMessage.react(emojiProposal.emoji.downVote);

  command.reply({
    embeds: [simpleEmbed(msgParams(commands.emoji.exec.pollSent, [generalChannelId]))],
    ephemeral: true
  });

  const reactionCollector = voteMessage.createReactionCollector({
    filter: (reaction, user) => {
      return (
        reaction.emoji.name === emojiProposal.emoji.upVote || reaction.emoji.name === emojiProposal.emoji.downVote
      ) && user.id !== command.user.id;
    },
    time: 1000 * 60 * 20
  });

  reactionCollector.on("collect", (reaction) => {
    if (reaction.emoji.name === emojiProposal.emoji.upVote && reaction.count >= emojiProposal.reactionNeededCount.upVote) {
      return reactionCollector.stop(StopReason.ACCEPTED);
    }

    if (reaction.count >= emojiProposal.reactionNeededCount.downVote) {
      return reactionCollector.stop(StopReason.REFUSED);
    }
  });

  reactionCollector.on("end", (collected, reason) => {
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