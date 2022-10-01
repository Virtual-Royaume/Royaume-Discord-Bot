import { msg } from "$core/utils/Message";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { verify } from "$resources/config/information.json";
import { request } from "$core/api/Request";
import { getMonthActivity, GetMonthActivityType } from "$core/api/requests/Member";
import { simpleEmbed } from "$core/utils/Embed";
import Command from "$core/commands/Command";
import Client from "$core/Client";

export default class Inactive extends Command {

    public readonly slashCommand = new SlashCommandBuilder()
        .setName(msg("cmd-inactive-builder-name"))
        .setDescription(msg("cmd-inactive-builder-description"));

    public async execute(command: ChatInputCommandInteraction): Promise<void> {
        const verifMembers = (await (await Client.instance.getGuild()).members.fetch()).filter(m => m.roles.cache.has(verify.roles.waiting));
        const members = (await request<GetMonthActivityType>(getMonthActivity))
            .members.filter(member => {
                const isInVerif = verifMembers.has(member._id);
                const monthMessage = member.activity?.messages.monthCount;
                const monthVoice = member.activity?.monthVoiceMinute;

                return !monthMessage && !monthVoice && !isInVerif;
            });

        if (members.length) {
            const message = members.map(member => "<@" + member._id + ">").join(", ");

            command.reply({ embeds: [simpleEmbed(message, "normal", msg("cmd-inactive-exec-inactives"))], ephemeral: true });
        } else {
            command.reply({ embeds: [simpleEmbed(msg("cmd-inactive-exec-no-inactives"), "error")], ephemeral: true });
        }
    }
}