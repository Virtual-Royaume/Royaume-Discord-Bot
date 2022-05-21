import { SlashCommandBuilder, SlashCommandStringOption } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed, MessageButton, MessageActionRow } from "discord.js";
import { simpleEmbed } from "../../utils/Embed";
import Command from "../Command";

export default class Interaction extends Command {

    public readonly slashCommand = new SlashCommandBuilder()
        .setName("Interaction")
        .setDescription("Permet d'envoyer une interaction dans le salon.")
        .addStringOption(new SlashCommandStringOption()
            .setName("name")
            .setDescription("Choisir l'intéraction à envoyer.")
            .addChoices({
                name: "Vérification",
                value: "verification"
            })
        );

    public async execute(command: CommandInteraction): Promise<void> {
        const verify = command.options.getString("name");

        if (verify === "verification") {
            const embed = new MessageEmbed()
                .setTitle('Verification du Royaume !')
                .setDescription('Salut à toi ! Bienvenue sur le serveur discord du Royaume, une communauté.............')
                .setColor('#5339DD')

            // row temporaire
            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('verify')
                        .setLabel('Formulaire de vérification')
                        .setStyle('PRIMARY')
                        .setEmoji('👑'),
                );


            command.channel.send({
                embeds: [embed],
                components: [row],
            });

        }
    }
}
