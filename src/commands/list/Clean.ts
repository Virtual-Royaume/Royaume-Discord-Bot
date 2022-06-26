import { SlashCommandBuilder, SlashCommandNumberOption } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { simpleEmbed } from "../../utils/Embed";
import Command from "../Command";

export default class Clean extends Command {

    public readonly slashCommand = new SlashCommandBuilder()
        .setName("clean")
        .setDescription("Permet de supprimer plusieurs messages en même temps")
        .setDefaultMemberPermissions(0)
        .addNumberOption(new SlashCommandNumberOption()
            .setName("nombre")
            .setDescription("Nombre de message a supprimer")
            .setMinValue(1)
            .setMaxValue(100));

    public async execute(command: CommandInteraction) : Promise<void> {
        const number = command.options.getNumber("nombre") ?? 10;

        if (command.channel?.type !== "GUILD_TEXT") {
            command.reply({ embeds: [simpleEmbed("Vous devez utilisé cette commande dans un salon textuel.", "error")], ephemeral: true });
            return;
        }

        await command.channel.bulkDelete(number);

        command.reply({ embeds: [simpleEmbed(`Vous avez supprimé ${number} messages !`)], ephemeral: true });
    }
}