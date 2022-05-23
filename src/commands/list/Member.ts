import { SlashCommandBuilder, SlashCommandUserOption } from "@discordjs/builders";
import { CommandInteraction, GuildMember } from "discord.js";
import { memberEmbed, simpleEmbed } from "../../utils/Embed";
import Command from "../Command";

export default class Member extends Command {

    public readonly slashCommand = new SlashCommandBuilder()
        .setName("member")
        .setDescription("Voir les statistiques et information d'un utilisateur")
        .addUserOption(new SlashCommandUserOption()
            .setName("member")
            .setDescription("Membre ciblé")
        );

    public readonly defaultPermission: boolean = true;

    public async execute(command: CommandInteraction) : Promise<void> {
        
        const member = command.options.getMember("member") ?? command.member;

        // Check :
        if(!(member instanceof GuildMember)){
            command.reply({ 
                embeds: [simpleEmbed("Erreur lors de l'utilisation de la commande.")], 
                ephemeral: true 
            });
            return;
        }

        const embed = await memberEmbed(member.id);

        if(!embed){
            command.reply({ embeds: [simpleEmbed("Aucune donnée trouvée.", "error")], ephemeral: true });
            return;
        }

        command.reply({ embeds: [embed] });
    }
}