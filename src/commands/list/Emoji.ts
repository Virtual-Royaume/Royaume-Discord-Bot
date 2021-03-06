import { SlashCommandAttachmentOption, SlashCommandBuilder, SlashCommandStringOption } from "@discordjs/builders";
import { CommandInteraction, MessageAttachment, BaseGuildTextChannel, PremiumTier } from "discord.js";
import Command from "../Command";
import { generalChannel } from "../../../resources/config/information.json";
import { emojiProposal } from "../../../resources/config/proposal.json";
import { simpleEmbed } from "../../utils/Embed";
import Client from "../../Client";

const emojiForTier: Record<PremiumTier, number> = {
    "NONE": 50,
    "TIER_1": 100,
    "TIER_2": 150,
    "TIER_3": 250
};

export default class Emoji extends Command {

    public readonly slashCommand = new SlashCommandBuilder()
        .setName("emoji")
        .setDescription("Permet d'ajouter un nouvel émoji sur le serveur")
        .addAttachmentOption(new SlashCommandAttachmentOption()
            .setName("attachment")
            .setDescription("Envoyer le fichier du quel tu souhaites créer un emoji")
            .setRequired(true))
        .addStringOption(new SlashCommandStringOption()
            .setName("name")
            .setDescription("Choisir le nom de l'émoji")
            .setRequired(true));

    public async execute(command: CommandInteraction) : Promise<void> {
        const guild = await Client.instance.getGuild();
        const maxEmoji = emojiForTier[guild.premiumTier];

        const generalChannelInstance = await (await Client.instance.getGuild()).channels.fetch(generalChannel);

        if (!(generalChannelInstance instanceof BaseGuildTextChannel)) {
            command.reply({
                embeds: [simpleEmbed("Erreur lors de l'exécution de la commande.", "error")],
                ephemeral: true
            });
            return;
        }


        if (guild.emojis.cache.size >= maxEmoji) {
            command.reply({
                embeds: [simpleEmbed("Le serveur a atteint ça limite d'émojis,"
                 + " supprimez-en ou améliorer votre niveau à l'aide des boosts de serveur", "error")],
                ephemeral: true
            });
            return;
        }

        const attachment = command.options.getAttachment("attachment", true);
        const emojiIdentifier = command.options.getString("name", true);

        if (guild.emojis.cache.find(emoji => emoji.name == emojiIdentifier)) {
            command.reply({
                embeds: [simpleEmbed("Cet identifiant d'émoji `" + emojiIdentifier + "` existe déjà, choisissez en un autre", "error")],
                ephemeral: true
            });
            return;
        }

        // Send the vote message :
        const voteMessage = await generalChannelInstance.send({
            files: [new MessageAttachment(attachment.url, "image.png")],
            embeds: [simpleEmbed(
                "**Proposition d'un nouveau émoji sur le serveur :**"
                + `\n "\`\`${emojiIdentifier}\`\`"\n\nProposé par <@${command.user.id}>`,
                "normal",
                "Proposition d'émoji"
            )]
        });

        await voteMessage.react(emojiProposal.emoji.upVote);
        await voteMessage.react(emojiProposal.emoji.downVote);

        command.reply({
            embeds: [simpleEmbed(`Votre proposition pour un nouvel émoji a bien été envoyé dans le salon <#${generalChannel}>.`)],
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
                voteMessage.reply({ embeds: [simpleEmbed("Proposition accepté.")] });

                addEmojiRequest();
                removeReactions();
            }

            if (
                reaction.emoji.name === emojiProposal.emoji.downVote
                && reaction.count >= emojiProposal.reactionNeededCount.downVote
            ) {
                voteMessage.reply({ embeds: [
                    simpleEmbed("Proposition refusé.", "error")
                ] });

                removeReactions();
            }
        });

        reactionCollector.on("end", () => {
            if (!voteMessage.reactions.cache.size) {
                voteMessage.reply({ embeds: [
                    simpleEmbed("Le temps de vote pour cette proposition est écoulé.", "error")
                ] });

                removeReactions();
            }
        });
        return;
    }
}