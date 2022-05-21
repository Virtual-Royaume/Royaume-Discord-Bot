import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageActionRow, MessageSelectMenu, GuildMemberRoleManager } from "discord.js";
import Command from "../Command";
import { simpleEmbed } from "../../utils/Embed";
import { getRolesByCategory } from "../../api/func/MainRole";
import { selectMenu } from "../../../resources/config/interaction-ids.json";
import Client from "../../Client";

export default class Role extends Command {

    public readonly slashCommand = new SlashCommandBuilder()
        .setName("role")
        .setDescription("Permet de choisir ses rôles");

    public readonly defaultPermission: boolean = true;

    public async execute(command: CommandInteraction) : Promise<void> {
        // Generate select menu :
        const messageActionRows: MessageActionRow[] = [];

        for(const [category, rolesId] of Object.entries(await getRolesByCategory())){
            // Create category interaction :
            const interaction = new MessageSelectMenu()
                .setCustomId(`${selectMenu.rolesSelector}-${category}`)
                .setMinValues(0)
                .setMaxValues(rolesId.length)
                .setPlaceholder(category);

            for(const roleId of rolesId){
                // Get role instance :
                const role = await Client.instance.getGuild().roles.fetch(roleId);

                if(!role) continue;

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