import {
  ChatInputCommandInteraction, AttachmentBuilder, BaseGuildTextChannel,
  GuildPremiumTier, SlashCommandAttachmentOption, SlashCommandBuilder,
  SlashCommandStringOption
} from "discord.js";
import { msg } from "$core/utils/Message";
import Command from "$core/commands/Command";
import { generalChannel } from "$resources/config/information.json";
import { emojiProposal } from "$resources/config/proposal.json";
import { simpleEmbed } from "$core/utils/Embed";
import Client from "$core/Client";

const emojiForTier: Record<GuildPremiumTier, number> = {
  "0": 50,
  "1": 100,
  "2": 150,
  "3": 250
};

export default class Emoji extends Command {

  public readonly slashCommand = new SlashCommandBuilder()
    .setName(msg("cmd-emoji-builder-name"))
    .setDescription(msg("cmd-emoji-builder-description"))
    .addAttachmentOption(new SlashCommandAttachmentOption()
      .setName(msg("cmd-emoji-builder-attachment-name"))
      .setDescription(msg("cmd-emoji-builder-attachment-description"))
      .setRequired(true))
    .addStringOption(new SlashCommandStringOption()
      .setName(msg("cmd-emoji-builder-name-name"))
      .setDescription(msg("cmd-emoji-builder-name-description"))
      .setRequired(true));

  public async execute(command: ChatInputCommandInteraction) : Promise<void> {
    const guild = await Client.instance.getGuild();
    const maxEmoji = emojiForTier[guild.premiumTier];

    const generalChannelInstance = await (await Client.instance.getGuild()).channels.fetch(generalChannel);

    if (!(generalChannelInstance instanceof BaseGuildTextChannel)) {
      command.reply({
        embeds: [simpleEmbed(msg("cmd-emoji-exec-error"), "error")],
        ephemeral: true
      });
      return;
    }


    if (guild.emojis.cache.size >= maxEmoji) {
      command.reply({
        embeds: [simpleEmbed(msg("cmd-emoji-exec-emojies-full"), "error")],
        ephemeral: true
      });
      return;
    }

    const attachment = command.options.getAttachment(msg("cmd-emoji-builder-attachment-name"), true);
    const emojiIdentifier = command.options.getString(msg("cmd-emoji-builder-name-name"), true);

    if (guild.emojis.cache.find(emoji => emoji.name == emojiIdentifier)) {
      command.reply({
        embeds: [simpleEmbed(msg("cmd-emoji-exec-emoji-already-exists"), "error")],
        ephemeral: true
      });
      return;
    }

    // Send the vote message :
    const voteMessage = await generalChannelInstance.send({
      files: [new AttachmentBuilder(attachment.url, { name: "image.png" })],
      embeds: [simpleEmbed(
        msg("cmd-emoji-exec-embed-poll-text", [emojiIdentifier, command.user.id]),
        "normal",
        msg("cmd-emoji-exec-embed-poll-title")
      )]
    });

    await voteMessage.react(emojiProposal.emoji.upVote);
    await voteMessage.react(emojiProposal.emoji.downVote);

    command.reply({
      embeds: [simpleEmbed(msg("cmd-emoji-exec-embed-poll-sent", [generalChannel]), "normal")],
      ephemeral: true
    });

    const reactionCollector = voteMessage.createReactionCollector({
      filter: (reaction, user) => {
        return (reaction.emoji.name === emojiProposal.emoji.upVote
                    || reaction.emoji.name === emojiProposal.emoji.downVote)
                    && user.id !== command.user.id;
      },
      time: 60_000 * 20
    });

    const removeReactions = () => voteMessage.reactions.removeAll();
    const addEmojiRequest = () => command.guild?.emojis.create({ attachment: attachment?.url, name: emojiIdentifier });

    reactionCollector.on("collect", (reaction) => {
      if (
        reaction.emoji.name === emojiProposal.emoji.upVote
                && reaction.count >= emojiProposal.reactionNeededCount.upVote
      ) {
        voteMessage.reply({ embeds: [simpleEmbed(msg("cmd-emoji-exec-embed-accepted-poll-text"))] });

        addEmojiRequest();
        removeReactions();
      }

      if (
        reaction.emoji.name === emojiProposal.emoji.downVote
                && reaction.count >= emojiProposal.reactionNeededCount.downVote
      ) {
        voteMessage.reply({ embeds: [
          simpleEmbed(msg("cmd-emoji-exec-embed-refused-poll-text"), "error")
        ] });

        removeReactions();
      }
    });

    reactionCollector.on("end", () => {
      if (!voteMessage.reactions.cache.size) {
        voteMessage.reply({ embeds: [
          simpleEmbed(msg("cmd-emoji-exec-poll-timeout"), "error")
        ] });

        removeReactions();
      }
    });
    return;
  }
}