import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { request } from "../../api/Request";
import { getMonthActivity } from "../../api/requests/Member";
import { MakeOptional, Member } from "../../api/Schema";
import { simpleEmbed } from "../../utils/Embed";
import Command from "../Command";

export default class Inactive extends Command {

    public readonly slashCommand = new SlashCommandBuilder()
        .setName("inactive")
        .setDescription("Voir les membres inactifs ce mois-ci");
    
    public readonly defaultPermission: boolean = true;

    public async execute(command: CommandInteraction) : Promise<void> {
        const members = (await request<{ members: MakeOptional<Member, keyof Member>[] }>(getMonthActivity))
            .members.filter(member => {
                const monthMessage = member.activity?.messages.monthCount;
                const monthVoice = member.activity?.monthVoiceMinute;

                return !monthMessage && !monthVoice;
            });

        if(members.length){
            const message = members.map(member => "<@" + member._id + ">").join(", ");

            command.reply({ embeds: [simpleEmbed(message, "normal", "Liste des membres inactif")], ephemeral: true });
        } else {
            command.reply({ embeds: [simpleEmbed("Aucun membre n'est inactif.", "error")], ephemeral: true });
        }
    }
}