import { SlashCommandBuilder, SlashCommandUserOption } from "@discordjs/builders";
import { CommandInteraction, GuildMember } from "discord.js";
import { request } from "../../api/Request";
import { getMember, GetMemberType } from "../../api/requests/Member";
import { simpleEmbed } from "../../utils/Embed";
import Command from "../Command";
import { getChannels, GetChannelsType } from "../../api/requests/MainChannel";
import { dateFormat, firstLetterToUppercase, getAge, numberFormat, formatMinutes } from "../../utils/Function";
import DayJS from "../../utils/DayJS";

export default class Member extends Command {

    public readonly slashCommand = new SlashCommandBuilder()
        .setName("member")
        .setDescription("Voir les statistiques et information d'un utilisateur")
        .addUserOption(new SlashCommandUserOption()
            .setName("member")
            .setDescription("Membre ciblé"));

    public readonly defaultPermission: boolean = true;

    public async execute(command: CommandInteraction): Promise<void> {
        const member = command.options.getMember("member") ?? command.member;

        // Check :
        if (!(member instanceof GuildMember)) {
            command.reply({
                embeds: [simpleEmbed("Erreur lors de l'utilisation de la commande.")],
                ephemeral: true
            });
            return;
        }

        // Get member info :
        const memberInfo = (await request<GetMemberType>(getMember, { id: member.id })).member;

        if (!memberInfo) {
            command.reply({ embeds: [simpleEmbed("Aucune donnée trouvée.", "error")], ephemeral: true });
            return;
        }

        // Get main channels en sort it :
        const channels = (await request<GetChannelsType>(getChannels)).channels;
        const channelsIdsByCategory: { [category: string]: string[] } = {};

        channels.forEach(channel => {
            if (!channelsIdsByCategory[channel.category]) channelsIdsByCategory[channel.category] = [];

            channelsIdsByCategory[channel.category].push(channel.channelId);
        });

        // Format message :
        let message = "";

        if (memberInfo.birthday) {
            const birthday = DayJS(memberInfo.birthday).tz();

            message += `**👶 Né le ${dateFormat(birthday, "/")} *(${getAge(birthday)} ans)***\n\n`;
        }

        const memberActivity = memberInfo.activity;

        message += `**🔊 Temps de vocal (en minute) :** ${formatMinutes(memberActivity.voiceMinute)}\n`;
        message += `**🔉 Temps de vocal ce mois (en minute) :** ${formatMinutes(memberActivity.monthVoiceMinute)}\n\n`;

        message += `**📜 Nombre de message :** ${numberFormat(memberActivity.messages.totalCount)}\n`;
        message += `**📝 Nombre de message ce mois :** ${numberFormat(memberActivity.messages.monthCount)}\n\n`;

        message += "**📺 Nombre de message par salon :**\n";

        const embed = simpleEmbed(message, "normal", `Activité de ${member.displayName}`);

        for (const [category, channelIds] of Object.entries(channelsIdsByCategory)) {
            embed.addField(
                firstLetterToUppercase(category),
                channelIds.map(channelId => {
                    const messageCount = memberInfo.activity.messages.perChannel
                        .find(channel => channel?.channelId === channelId)?.messageCount ?? 0;

                    return `${messageCount} dans <#${channelId}>`;
                }).join("\n")
            );
        }

        command.reply({
            embeds: [embed]
        });
    }
}