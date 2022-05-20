import { GuildMemberRoleManager, Interaction } from "discord.js";
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
        if(!interactionId.startsWith( Role.SELECT_MENU_PREFIX )) return;

        const category = interactionId.replace(Role.SELECT_MENU_PREFIX, "");

        const allRoles = interaction.component.options.map( option => option.value );
        const selectedRoles = interaction.values;
        const unselectedRoles = allRoles.filter(role => !selectedRoles.includes(role));

        let memberRoles = interaction.member?.roles;

        if( !(memberRoles instanceof GuildMemberRoleManager) ){
            interaction.reply({embeds:[ simpleEmbed("Une erreur s'est produite lors de l'acquisition des roles.", "error") ]});
            return;
        }

        await memberRoles.add(selectedRoles);
        await memberRoles.remove(unselectedRoles);

        interaction.reply({
            embeds: [simpleEmbed(`Modifications éffectuées dans la categorie **${category}** !`)],
            ephemeral: true
        });
    }
}