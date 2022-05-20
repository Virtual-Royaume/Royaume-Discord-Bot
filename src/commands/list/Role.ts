import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageActionRow, MessageSelectMenu, Constants, GuildMemberRoleManager } from "discord.js";
import Command from "../Command";
import { getRoles } from "../../api/requests/MainRole";
import { MainRole } from "../../api/Schema";
import { request } from "../../api/Request";
import { simpleEmbed } from "../../utils/Embed";

export default class Role extends Command {

    public readonly slashCommand = new SlashCommandBuilder()
        .setName("role")
        .setDescription("Permet de choisir ses rôles");

    public readonly defaultPermission: boolean = true;

    public static readonly SELECT_MENU_PREFIX = "roles_selector_"; 

    public async execute(command: CommandInteraction) : Promise<void> {

        const roles = (await request<{ roles: MainRole[] }>(getRoles)).roles;

        /**
         * Key      : Category
         * Value    : Roles IDs
         */
        let categories: { [category: string]: string[] } = {};
        roles.forEach(role => {

            if (!categories[role.category]) categories[role.category] = [];

            categories[role.category].push(role.roleId);
        });

        const guild = command.guild;
        if(!guild){
            command.reply({embeds:[ simpleEmbed("Vous devez être sur un serveur pour pouvoir faire cela !", "error") ]});
            return;
        }

        let messageActionRows: MessageActionRow[] = [];

        /** If a role doesn't exist */
        let roleError = false;
        for( const category in categories ){

            const rolesIDs = categories[category];
            
            let selectMenu = new MessageSelectMenu()
            .setCustomId(`${Role.SELECT_MENU_PREFIX}${category}`)
            .setMinValues(0)
            .setMaxValues(rolesIDs.length)
            .setPlaceholder(category)

            rolesIDs.forEach(async roleID => {

                const role = await guild.roles.fetch(roleID).catch(err => {
                    if(err.code === Constants.APIErrors.UNKNOWN_ROLE) return;
                    console.error(err);
                });

                if(!role){
                    roleError = true;
                    return;
                }

                const roleName = role.name;

                const memberRoles = command.member?.roles;
                const haveRole = memberRoles instanceof GuildMemberRoleManager ? memberRoles.cache.has(roleID) : false;

                selectMenu.addOptions({
                    label: roleName,
                    value: roleID,
                    default: haveRole
                });
            });

            messageActionRows.push(
                new MessageActionRow()
                .addComponents(selectMenu)
            );
        }

        if(roleError){
            command.reply({
                embeds: [simpleEmbed("Une erreur s'est produite lors du chargement d'un ou plusieurs roles", "error")],
                allowedMentions: {
                    repliedUser: false
                }
            });
        }

        command.reply({
            embeds: [simpleEmbed("Veuillez choisir vos roles")],
            components: messageActionRows,
            ephemeral: true
        });
    }
}