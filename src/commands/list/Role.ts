import { ChatInputCommandInteraction, MessageActionRow, MessageSelectMenu, GuildMemberRoleManager, SlashCommandBuilder } from "discord.js";
import Command from "$core/commands/Command";
import { simpleEmbed } from "$core/utils/Embed";
import { getRolesByCategory } from "$core/api/func/MainRole";
import { selectMenu } from "$resources/config/interaction-ids.json";
import Client from "$core/Client";

export default class Role extends Command {

    public readonly slashCommand = new SlashCommandBuilder()
        .setName("role")
        .setDescription("Permet de choisir ses rôles");

    public async execute(command: ChatInputCommandInteraction) : Promise<void> {
        // Generate select menu :
        const messageActionRows: MessageActionRow[] = [];

        for (const [category, rolesId] of Object.entries(await getRolesByCategory())) {
            // Create category interaction :
            const interaction = new MessageSelectMenu()
                .setCustomId(`${selectMenu.rolesSelector}-${category}`)
                .setMinValues(0)
                .setMaxValues(rolesId.length)
                .setPlaceholder(category);

            for (const roleId of rolesId) {
                // Get role instance :
                const role = await (await Client.instance.getGuild()).roles.fetch(roleId);

                if (!role) continue;

                // Add interaction options :
                const memberRoles = command.member?.roles;

                interaction.addOptions({
                    label: role.name,
                    value: roleId,
                    default: memberRoles instanceof GuildMemberRoleManager ? memberRoles.cache.has(roleId) : false
                });
            }

            // Add interaction in message action row :
            messageActionRows.push(new MessageActionRow().addComponents(interaction));
        }

        // Send the interaction :
        command.reply({
            embeds: [simpleEmbed("", "normal", "Veuillez choisir vos roles")],
            components: messageActionRows,
            ephemeral: true
        });
    }
}