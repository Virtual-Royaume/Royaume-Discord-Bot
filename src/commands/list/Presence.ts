import {
    BaseGuildTextChannel, ChatInputCommandInteraction,
    GuildMember, SlashCommandBuilder, SlashCommandNumberOption,
    SlashCommandStringOption
} from "discord.js";
import { request } from "$core/api/Request";
import {
    addPresenceMessage, getPresenceMessages,
    GetPresenceMessagesType, removePresenceMessage,
    RemovePresenceMessageType,
    RemovePresenceMessageVariables
} from "$core/api/requests/PresenceMessage";
import { generalChannel } from "$resources/config/information.json";
import { activityProposal } from "$resources/config/proposal.json";
import { PresenceType } from "$core/api/Schema";
import { simpleEmbed } from "$core/utils/Embed";
import Command from "$core/commands/Command";
import Client from "$core/Client";
import { msg } from "$core/utils/Message";

type Action = "add" | "remove" | "list";

type ActionChoices = {
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
        .setName(msg("cmd-presence-builder-name"))
        .setDescription(msg("cmd-presence-builder-description"))
        .addStringOption(new SlashCommandStringOption()
            .setName(msg("cmd-presence-builder-action-name"))
            .setDescription(msg("cmd-presence-builder-action-description"))
            .addChoices(...this.actionChoices)
            .setRequired(true))

        .addNumberOption(new SlashCommandNumberOption()
            .setName(msg("cmd-presence-builder-page-name"))
            .setDescription(msg("cmd-presence-builder-page-description"))
            .setMinValue(1))

        .addStringOption(new SlashCommandStringOption()
            .setName(msg("cmd-presence-builder-presence-name"))
            .setDescription(msg("cmd-presence-builder-presence-description"))
            .addChoices(...this.presenceTypes))
        .addStringOption(new SlashCommandStringOption()
            .setName(msg("cmd-presence-builder-message-name"))
            .setDescription(msg("cmd-presence-builder-message-description")))

        .addStringOption(new SlashCommandStringOption()
            .setName("id")
            .setDescription("Id de l'activité à supprimer"));

    public async execute(command: ChatInputCommandInteraction): Promise<void> {
        // Get action and execute function of this action :
        const action: Action = <Action>command.options.getString("action", true);

        if (action === "add") return this.add(command);
        if (action === "remove") return this.remove(command);
        if (action === "list") return this.list(command);
    }

    private async add(command: ChatInputCommandInteraction): Promise<void> {
        const presence = command.options.getString(msg("cmd-presence-builder-presence-name"));
        const message = command.options.getString(msg("cmd-presence-builder-message-name"));

        // Checks :
        if (!presence || !message) {
            command.reply({
                embeds: [simpleEmbed(msg("cmd-presence-exec-embed-missing-parameters"), "error")],
                ephemeral: true
            });
            return;
        }

        if (!(command.member instanceof GuildMember)) {
            command.reply({
                embeds: [simpleEmbed(msg("message-execution-error-cmd"), "error")],
                ephemeral: true
            });
            return;
        }

        // Create function for the request for add presence message :
        const addPresenceRequest = async() => await request(addPresenceMessage, { type: presence, text: message });

        // Add the new presence message if command author is admin, if he is not admin send a proposal in general channel :
        if (command.member.permissions.has("Administrator")) {
            await addPresenceRequest();

            command.reply({
                embeds: [simpleEmbed(msg("cmd-presence-exec-embed-new-activity-succes"))],
                ephemeral: true
            });
        } else {
            // Get the general channel :
            const generalChannelInstance = await (await Client.instance.getGuild()).channels.fetch(generalChannel);

            if (!(generalChannelInstance instanceof BaseGuildTextChannel)) {
                command.reply({
                    embeds: [simpleEmbed(msg("message-execution-error-cmd"), "error")],
                    ephemeral: true
                });
                return;
            }

            // Send the proposal/vote message :
            const voteMessage = await generalChannelInstance.send({
                embeds: [
                    simpleEmbed(
                        msg("cmd-presence-exec-embed-new-activity-proposal", [
                            presence,
                            message,
                            command.user.id
                        ])
                    )
                ]
            });

            // Add reactions to the proposal message :
            await voteMessage.react(activityProposal.emoji.upVote);
            await voteMessage.react(activityProposal.emoji.downVote);

            // Confirm the creation of the proposal message :
            command.reply({
                embeds: [simpleEmbed(msg("cmd-presence-exec-embed-new-activity-proposal-succes", [generalChannel]))],
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
                    voteMessage.reply({ embeds: [simpleEmbed(msg("cmd-presence-exec-embed-activity-proposal-accepted"))] });

                    addPresenceRequest();
                    removeReactions();
                }

                if (
                    reaction.emoji.name === activityProposal.emoji.downVote
                    && reaction.count >= activityProposal.reactionNeededCount.downVote
                ) {
                    voteMessage.reply({
                        embeds: [
                            simpleEmbed(msg("cmd-presence-exec-embed-activity-proposal-refused"), "error")
                        ]
                    });

                    removeReactions();
                }
            });

            reactionCollector.on("end", () => {
                if (!voteMessage.reactions.cache.size) {
                    voteMessage.reply({
                        embeds: [
                            simpleEmbed(msg("cmd-presence-exec-embed-activity-proposal-time-limit"), "error")
                        ]
                    });

                    removeReactions();
                }
            });
        }
    }

    private async remove(command: ChatInputCommandInteraction): Promise<void> {
        const id = command.options.getString("id");

        // Checks :
        if (!id) {
            command.reply({
                embeds: [simpleEmbed(msg("cmd-presence-exec-embed-activity-delete-missing-id"), "error")],
                ephemeral: true
            });
            return;
        }

        if (!(command.member instanceof GuildMember)) {
            command.reply({
                embeds: [simpleEmbed(msg("message-execution-error-cmd"), "error")],
                ephemeral: true
            });
            return;
        }

        if (!command.member.permissions.has("Administrator")) {
            command.reply({
                embeds: [simpleEmbed("Vous n'avez pas la permission de supprimer une activité.", "error")],
                ephemeral: true
            });
            return;
        }

        // Try to delete the presence message :
        try {
            const deleted = await request<RemovePresenceMessageType, RemovePresenceMessageVariables>(removePresenceMessage, { id });

            if (deleted.removePresenceMessage) {
                command.reply({ embeds: [simpleEmbed(msg("cmd-presence-exec-embed-delete-activity-succes"))], ephemeral: true });
            } else {
                command.reply({
                    embeds: [simpleEmbed(msg("cmd-presence-exec-embed-delete-activity-fail"), "error")],
                    ephemeral: true
                });
            }
        } catch {
            command.reply({
                embeds: [simpleEmbed(msg("cmd-presence-exec-embed-delete-activity-error"), "error")],
                ephemeral: true
            });
        }
    }

    private async list(command: ChatInputCommandInteraction): Promise<void> {
        // Get data and sort it :
        let presenceMessages = (await request<GetPresenceMessagesType, undefined>(getPresenceMessages)).presenceMessages;

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

            message += msg("cmd-presence-exec-embed-activity-list-activity", [
                presence._id,
                presence.type,
                presence.text
            ]);
        }

        // Send leaderboard :
        command.reply({
            embeds: [simpleEmbed(message, "normal", msg("cmd-presence-exec-embed-activity-list-title", [page, maxPage]))]
        });
    }
}