import { Constants, GuildMemberManager, GuildMemberRoleManager, Interaction, Role as RoleDjs } from "discord.js";
import { request } from "../../api/Request";
import { getChannels } from "../../api/requests/MainChannel";
import { incChannelMessage } from "../../api/requests/Member";
import { MainChannel } from "../../api/Schema";
import Role from "../../commands/list/Role";
import { simpleEmbed } from "../../utils/Embed";
import Event from "../Event";

export default class RolesSelector extends Event {
    
    public name: string = "interactionCreate";

    public async execute(interaction: Interaction) : Promise<void> {

        const guild = interaction.guild;
        if( !guild ) return;

        if(!interaction.isSelectMenu()) return;
        
        const interactionId = interaction.customId;
        if(!interactionId.startsWith(Role.SELECT_MENU_PREFIX)) return;

        const category = interactionId.replace(Role.SELECT_MENU_PREFIX, "");

        const allRoles = interaction.component.options.map( option => option.value );

        const selectedRoles = interaction.values;
        const unselectedRoles = allRoles.filter(role => !selectedRoles.includes(role));

        let memberRoles = interaction.member?.roles;

        if( !(memberRoles instanceof GuildMemberRoleManager) ) return;

        /** If a role didn't exist */
        let roleError = false;

        let rolesToAdd: RoleDjs[] = [];
        let rolesToRemove: RoleDjs[] = [];

        for(const roleID of allRoles){
            console.log(roleID);
            const role = await guild.roles.fetch(roleID).catch(err => {
                if(err.code === Constants.APIErrors.UNKNOWN_ROLE) return;
                console.error(err);
            });

            if(!role){
                roleError = true;
                return;
            }

            if( selectedRoles.includes(roleID) ){
                rolesToAdd.push(role);
                console.log("Add :" + role);
            }else{
                console.log("Remove :" + role);
                rolesToRemove.push(role);
            }
        }

        if(roleError){
            interaction.reply({
                embeds: [simpleEmbed("Une erreur s'est produite lors du chargement d'un des roles", "error")],
                allowedMentions: {
                    repliedUser: false
                }
            });
        }

        console.log(rolesToAdd, rolesToRemove);
        await memberRoles.add(rolesToAdd);
        await memberRoles.remove(rolesToRemove);

        const mentionableRolesToAdd = selectedRoles.map( role => `<@&${role}>` );
        const mentionableRolesToRemove = unselectedRoles.map( role => `<@&${role}>` );

        interaction.reply({
            embeds: [simpleEmbed(`Les roles ${mentionableRolesToAdd.join(", ")} vous ont été ajoutés\nLes roles ${mentionableRolesToRemove.join(", ")} vous ont été retirés`)],
            ephemeral: true
        });
    }
}