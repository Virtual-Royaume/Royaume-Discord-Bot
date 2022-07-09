import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageAttachment, BaseGuildTextChannel } from "discord.js";
import Command from "../Command";
import { generalChannel, emojiProposal } from "../../../resources/config/information.json";
import { simpleEmbed } from "../../utils/Embed";
import Client from "../../Client";

export default class Emoji extends Command {

    public readonly slashCommand = new SlashCommandBuilder()
        .setName("emoji")
        .setDescription("Proposer un émoji")
        .addAttachmentOption(option => option.setName("image").setDescription("Emoji").setRequired(true))
        .addStringOption(option => option.setName("name").setDescription("Nom de l'émoji").setRequired(true));

    public async execute(command: CommandInteraction) : Promise<void> {
        const guild = await Client.instance.getGuild();

        const generalChannelInstance = await (await Client.instance.getGuild()).channels.fetch(generalChannel);

        if (!(generalChannelInstance instanceof BaseGuildTextChannel)) {
            command.reply({
                embeds: [simpleEmbed("Erreur lors de l'exécution de la commande.", "error")],
                ephemeral: true
            });
            return;
        }

        const serverTier = guild.premiumTier;

        let maxSize = 50;
        if (serverTier == "TIER_1") maxSize = 100;
        else if (serverTier == "TIER_2") maxSize = 150;
        else if (serverTier == "TIER_3") maxSize = 250;


        if (guild.emojis.cache.size >= maxSize) {
            command.reply({
                embeds: [simpleEmbed("Le serveur a atteint ça limite d'émojis,"
                 + " supprimez-en ou améliorer votre niveau à l'aide des boosts de serveur", "error")],
                ephemeral: true
            });
            return;
        }

        const attachment = command.options.getAttachment("attachment");
        const emojiIdentifier = command.options.getString("name");

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