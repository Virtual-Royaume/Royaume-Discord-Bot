import {
    ChannelType,
    ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandChannelOption,
    SlashCommandRoleOption, SlashCommandStringOption
} from "discord.js";
import { msg } from "$core/utils/Message";
import { getChannelsByCategory } from "$core/api/func/MainChannel";
import { getRolesByCategory } from "$core/api/func/MainRole";
import {
    addChannel, AddChannelType, AddChannelVariables,
    removeChannel, RemoveChannelType, RemoveChannelVariables
} from "$core/api/requests/MainChannel";
import { addRole, AddRoleType, AddRoleVariables, removeRole, RemoveRoleType, RemoveRoleVariables } from "$core/api/requests/MainRole";
import { simpleEmbed } from "$core/utils/Embed";
import Command from "$core/commands/Command";
import { gqlRequest } from "$core/utils/Request";

type Action = "add" | "remove" | "list";

type ActionChoices = {
    name: string;
    value: Action;
}

export default class Inactive extends Command {

    private actionChoices: ActionChoices[] = [
        { name: "Ajout", value: "add" },
        { name: "Suppression", value: "remove" },
        { name: "Liste", value: "list" }
    ];

    public readonly slashCommand = new SlashCommandBuilder()
        .setName(msg("cmd-main-builder-name"))
        .setDescription(msg("cmd-main-builder-description"))
        .setDefaultMemberPermissions(0)
        .addStringOption(new SlashCommandStringOption()
            .setName(msg("cmd-main-builder-action-name"))
            .setDescription(msg("cmd-main-builder-action-description"))
            .addChoices(...this.actionChoices)
            .setRequired(true))
        .addChannelOption(new SlashCommandChannelOption()
            .setName(msg("cmd-main-builder-channel-name"))
            .setDescription(msg("cmd-main-builder-channel-description"))
            .addChannelTypes(ChannelType.GuildText))
        .addRoleOption(new SlashCommandRoleOption()
            .setName(msg("cmd-main-builder-role-name"))
            .setDescription(msg("cmd-main-builder-role-name")))
        .addStringOption(new SlashCommandStringOption()
            .setName(msg("cmd-main-builder-category-name"))
            .setDescription(msg("cmd-main-builder-category-name")));

    public async execute(command: ChatInputCommandInteraction): Promise<void> {
        // Get action, channel/role and category :
        const action: Action = <Action>command.options.getString("action", true);

        const channel = command.options.getChannel(msg("cmd-main-builder-channel-name"));
        const role = command.options.getRole(msg("cmd-main-builder-role-name"));

        const category = command.options.getString(msg("cmd-main-builder-category-name"));

        // List action :
        if (action === "list") {
            // Get mains channels and roles :
            const channels = await getChannelsByCategory();
            const roles = await getRolesByCategory();

            // Format and send the lists :
            let channelMessage = "";
            let roleMessage = "";

            for (const [category, ids] of Object.entries(channels)) {
                channelMessage += msg("cmd-main-exec-channel-message", [category, ids.map(id => "<#" + id + ">").join(", ")]) + "\n\n";
            }

            for (const [category, ids] of Object.entries(roles)) {
                roleMessage += msg("cmd-main-exec-channel-message", [category, ids.map(id => "<@&" + id + ">").join(", ")]) + "\n\n";
            }

            command.reply({
                embeds: [
                    simpleEmbed(channelMessage, "normal", msg("cmd-main-exec-channels-title")),
                    simpleEmbed(roleMessage, "normal", msg("cmd-main-exec-role-title"))
                ], ephemeral: true
            });
            return;
        }

        // Add and remove actions :
        type Result = {
            success?: boolean;
            action?: "add" | "remove";
            type?: "role" | "channel";
        }

        if (action === "add" && !category) {
            command.reply({ embeds: [simpleEmbed(msg("cmd-main-exec-need-category"), "error")], ephemeral: true });
            return;
        }

        if (!channel || !role) {
            command.reply({ embeds: [simpleEmbed("cmd-main-exec-need-mention", "error")], ephemeral: true });
            return;
        }

        const result: Result = { action: action };

        if (channel) {
            result.type = "channel";
            result.success = action === "add" && category
                ? (await gqlRequest<AddChannelType, AddChannelVariables>(addChannel, { channelId: channel.id, category: category })).data?.addChannel
                : (await gqlRequest<RemoveChannelType, RemoveChannelVariables>(removeChannel, { channelId: channel.id })).data?.removeChannel;

        } else if (role) {
            result.type = "role";
            result.success = action === "add" && category
                ? (await gqlRequest<AddRoleType, AddRoleVariables>(addRole, { roleId: role.id, category: category })).data?.addRole
                : (await gqlRequest<RemoveRoleType, RemoveRoleVariables>(removeRole, { roleId: role.id })).data?.removeRole;
        }

        const type = result.type === "role" ? "rôle" : "salon";
        const message = result.success
            ? msg("cmd-main-exec-success-add", [result.action === "add" ? "ajouté" : "supprimé", type])
            : msg("cmd-main-exec-success-error", [result.action === "add" ? "l'ajout" : "la suppression", type]);

        command.reply({ embeds: [simpleEmbed(message, result.success ? "normal" : "error")], ephemeral: true });
    }
}