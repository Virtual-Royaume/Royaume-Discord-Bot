import { SlashCommandBuilder, SlashCommandUserOption } from "@discordjs/builders";
import { CommandInteraction, GuildMember } from "discord.js";
import { request } from "../../api/Request";
import { getMember } from "../../api/requests/Member";
import { simpleEmbed } from "../../utils/Embed";
import Command from "../Command";
import { MainChannel, Member as MemberSchema } from "../../api/Schema";
import { getChannels } from "../../api/requests/MainChannel";

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

        // Get member info :
        const memberInfo = (await request<{ member: MemberSchema }>(getMember, { id: member.id })).member;
        
        if(!memberInfo){
            command.reply({ embeds: [simpleEmbed("Aucune donnée trouvée.", "error")], ephemeral: true });
            return;
        }

        // Get main channels en sort it :
        const channels = (await request<{ channels: MainChannel[] }>(getChannels)).channels;
        const channelsIdsByCategory: { [category: string]: string[] } = {}

        channels.forEach(channel => {
            if(!channelsIdsByCategory[channel.category]) channelsIdsByCategory[channel.category] = [];

            channelsIdsByCategory[channel.category].push(channel.channelId);
        });

        // Format message :
        let message = "";

        message += `**Temps de vocal (en minute) :** ${memberInfo.activity.voiceMinute.toLocaleString("fr-FR")}\n`;
        message += `**Nombre de message :** ${memberInfo.activity.messages.totalCount.toLocaleString("fr-FR")}\n`;
        message += `**Nombre de message ce mois :** ${memberInfo.activity.messages.monthCount.toLocaleString("fr-FR")}\n\n`;

        message += "**Nombre de message par salon :**\n";

        for(const [category, channelIds] of Object.entries(channelsIdsByCategory)){
            channelIds.forEach(channelId => {
                const channelInfo = memberInfo.activity.messages.perChannel.find(channel => channel?.channelId === channelId);

                if(channelInfo){
                    message += `${channelInfo.messageCount.toLocaleString("fr-FR")} dans <#${channelInfo?.channelId}> (${category})\n`;
                }
            });
        }

        command.reply({
            embeds: [simpleEmbed(message, "normal", `Activité de ${member.displayName}`)]
        });
    }
}