import { GuildMemberRoleManager, Interaction } from "discord.js";
import { simpleEmbed } from "../../utils/Embed";
import Event from "../Event";
import { selectMenu } from "../../../resources/config/interaction-ids.json";

export default class RolesSelector extends Event {
    
    public name: string = "interactionCreate";

    public async execute(interaction: Interaction) : Promise<void> {
        if(!interaction.isSelectMenu() || !interaction.customId.startsWith(selectMenu.rolesSelector)) return;

        // Get category :
        const category = interaction.customId.replace(`${selectMenu.rolesSelector}-`, "");

        // Get selected and un-selected roles :
        const selectedRoles = interaction.values;
        const unselectedRoles = interaction.component.options.map(option => option.value).filter(role => {
            return !selectedRoles.includes(role);
        });

        // Get member role manager :
        const memberRoles = interaction.member?.roles;

        if(!(memberRoles instanceof GuildMemberRoleManager)){
            interaction.reply({embeds: [simpleEmbed("Une erreur s'est produite lors de l'acquisition des roles.", "error")] });
            return;
        }

        // Add and remove selected/unselected roles :
        await memberRoles.add(selectedRoles);
        await memberRoles.remove(unselectedRoles);

        // Send confirmation :
        interaction.reply({
            embeds: [simpleEmbed(`Modifications de vos rôles effectuées dans la categorie **${category}**.`)],
            ephemeral: true
        });
    }
}