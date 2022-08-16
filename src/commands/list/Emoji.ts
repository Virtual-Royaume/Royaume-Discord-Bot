import { SlashCommandAttachmentOption, SlashCommandBuilder, SlashCommandStringOption } from "@discordjs/builders";
import { CommandInteraction, MessageAttachment, BaseGuildTextChannel, PremiumTier } from "discord.js";
import Command from "../Command";
import { generalChannel } from "../../../resources/config/information.json";
import { emojiProposal } from "../../../resources/config/proposal.json";
import { simpleEmbed } from "../../utils/Embed";
import Client from "../../Client";
import { msg } from "../../utils/Message";

const emojiForTier: Record<PremiumTier, number> = {
    "NONE": 50,
    "TIER_1": 100,
    "TIER_2": 150,
    "TIER_3": 250
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

    public async execute(command: CommandInteraction) : Promise<void> {
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
            files: [new MessageAttachment(attachment.url, "image.png")],
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
        const addEmojiRequest = () => command.guild?.emojis.create(attachment?.url, emojiIdentifier);

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