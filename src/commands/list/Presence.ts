import { SlashCommandBuilder, SlashCommandNumberOption, SlashCommandStringOption } from "@discordjs/builders";
import { BaseGuildTextChannel, CommandInteraction, GuildMember } from "discord.js";
import { request } from "../../api/Request";
import {
    addPresenceMessage, getPresenceMessages,
    GetPresenceMessagesType, removePresenceMessage,
    RemovePresenceMessageType
} from "../../api/requests/PresenceMessage";
import { generalChannel, activityProposal } from "../../../resources/config/information.json";
import { PresenceType } from "../../api/Schema";
import { simpleEmbed } from "../../utils/Embed";
import Command from "../Command";
import Client from "../../Client";

type Action = "add" | "remove" | "list";

interface ActionChoices {
    name: string;
    value: Action;
}

export default class Role extends Command {

    private actionChoices: ActionChoices[] = [
        { name: "Ajout", value: "add" },
        { name: "Suppression", value: "remove" },
        { name: "Liste", value: "list" }
    ];

    private presenceTypes = Object.values(PresenceType).map(presence => ({ name: presence, value: presence }));

    private messagePerPage = 20;

    public readonly slashCommand = new SlashCommandBuilder()
        .setName("presence")
        .setDescription("Gérer l'activité du bot Discord")
        .addStringOption(new SlashCommandStringOption()
            .setName("action")
            .setDescription("Ajout, suppression ou liste")
            .addChoices(...this.actionChoices)
            .setRequired(true))

        .addNumberOption(new SlashCommandNumberOption()
            .setName("page")
            .setDescription("Page de la liste")
            .setMinValue(1))

        .addStringOption(new SlashCommandStringOption()
            .setName("presence")
            .setDescription("Type de l'activité à ajouter")
            .addChoices(...this.presenceTypes))
        .addStringOption(new SlashCommandStringOption()
            .setName("message")
            .setDescription("Message de l'activité à ajouter"))

        .addStringOption(new SlashCommandStringOption()
            .setName("id")
            .setDescription("Id de l'activité à supprimer"));

    public readonly defaultPermission: boolean = true;

    public async execute(command: CommandInteraction) : Promise<void> {
        // Get action and execute function of this action :
        const action: Action = <Action>command.options.getString("action", true);

        if (action === "add") return this.add(command);
        if (action === "remove") return this.remove(command);
        if (action === "list") return this.list(command);
    }

    private async add(command: CommandInteraction) : Promise<void> {
        const presence = command.options.getString("presence");
        const message = command.options.getString("message");

        // Checks :
        if (!presence || !message) {
            command.reply({
                embeds: [simpleEmbed("Vous devez définir les paramètres ``presence`` et ``message``.", "error")],
                ephemeral: true
            });
            return;
        }

        if (!(command.member instanceof GuildMember)) {
            command.reply({
                embeds: [simpleEmbed("Erreur lors de l'exécution de la commande.", "error")],
                ephemeral: true
            });
            return;
        }

        // Create function for the request for add presence message :
        const addPresenceRequest = async() => await request(addPresenceMessage, { type: presence, text: message });

        // Add the new presence message if command author is admin, if he is not admin send a proposal in general channel :
        if (command.member.permissions.has("ADMINISTRATOR")) {
            await addPresenceRequest();

            command.reply({
                embeds: [simpleEmbed("Cette nouvelle activité a bien été sauvegardé.")],
                ephemeral: true
            });
        } else {
            // Get the general channel :
            const generalChannelInstance = await (await Client.instance.getGuild()).channels.fetch(generalChannel);

            if (!(generalChannelInstance instanceof BaseGuildTextChannel)) {
                command.reply({
                    embeds: [simpleEmbed("Erreur lors de l'exécution de la commande.", "error")],
                    ephemeral: true
                });
                return;
            }

            // Send the proposal/vote message :
            const voteMessage = await generalChannelInstance.send({ embeds: [
                simpleEmbed(
                    "**Proposition d'une nouvelle activité aléatoire sur le bot :**"
                    + `\n "\`\`${presence}\`\` ${message}"\n\nProposé par <@${command.user.id}>`,
                    "normal",
                    "Proposition d'activité"
                )
            ] });

            // Add reactions to the proposal message :
            await voteMessage.react(activityProposal.emoji.upVote);
            await voteMessage.react(activityProposal.emoji.downVote);

            // Confirm the creation of the proposal message :
            command.reply({
                embeds: [simpleEmbed(`Votre proposition de nouvelle activité a était envoyé dans le salon <#${generalChannel}>.`)],
                ephemeral: true
            });

            // Reaction collector for check if the proposal is accepted or rejected :
            const reactionCollector = voteMessage.createReactionCollector({
                filter: (reaction, user) => {
                    return (reaction.emoji.name === activityProposal.emoji.upVote
                        || reaction.emoji.name === activityProposal.emoji.downVote)
                        && user.id !== command.user.id;
                },
                time: 60_000 * 20
            });

            const removeReactions = () => voteMessage.reactions.removeAll();

            reactionCollector.on("collect", (reaction) => {
                if (
                    reaction.emoji.name === activityProposal.emoji.upVote
                    && reaction.count >= activityProposal.reactionNeededCount.upVote
                ) {
                    voteMessage.reply({ embeds: [simpleEmbed("Proposition accepté.")] });

                    addPresenceRequest();
                    removeReactions();
                }

                if (
                    reaction.emoji.name === activityProposal.emoji.downVote
                    && reaction.count >= activityProposal.reactionNeededCount.downVote
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
        }
    }

    private async remove(command: CommandInteraction) : Promise<void> {
        const id = command.options.getString("id");

        // Checks :
        if (!id) {
            command.reply({
                embeds: [simpleEmbed("Vous devez définir le paramètre ``id`` de l'activité que vous voulez supprimer.", "error")],
                ephemeral: true
            });
            return;
        }

        if (!(command.member instanceof GuildMember)) {
            command.reply({
                embeds: [simpleEmbed("Erreur lors de l'exécution de la commande.", "error")],
                ephemeral: true
            });
            return;
        }

        if (!command.member.permissions.has("ADMINISTRATOR")) {
            command.reply({
                embeds: [simpleEmbed("Vous n'avez pas la permission de supprimer une activité.", "error")],
                ephemeral: true
            });
            return;
        }

        // Try to delete the presence message :
        try {
            const deleted = await request<RemovePresenceMessageType>(removePresenceMessage, { id });

            if (deleted.removePresenceMessage) {
                command.reply({ embeds: [simpleEmbed("Vous avez bien supprimé cette activité.")], ephemeral: true });
            } else {
                command.reply({
                    embeds: [simpleEmbed("Cette ID n'est relié à aucune activité.", "error")],
                    ephemeral: true
                });
            }
        } catch {
            command.reply({
                embeds: [simpleEmbed("Votre ID est invalide.", "error")],
                ephemeral: true
            });
        }
    }

    private async list(command: CommandInteraction) : Promise<void> {
        // Get data and sort it :
        let presenceMessages = (await request<GetPresenceMessagesType>(getPresenceMessages)).presenceMessages;

        // Get page and max page :
        const maxPage = Math.ceil(presenceMessages.length / this.messagePerPage);
        let page = command.options.getNumber("page") ?? 1;
        page = page > maxPage ? maxPage : page;

        // Slice the members with page and max page :
        presenceMessages = presenceMessages.slice(page * this.messagePerPage - this.messagePerPage, page * this.messagePerPage);

        // Format leaderboard :
        let message = "";

        for (let i = 0; i < presenceMessages.length; i++) {
            const presence = presenceMessages[i];

            message += `${presence._id} : \`\`${presence.type}\`\` ${presence.text}\n\n`;
        }

        // Send leaderboard :
        command.reply({
            embeds: [simpleEmbed(message, "normal", `Liste des messages d'activité du bot (page : ${page}/${maxPage})`)]
        });
    }
}