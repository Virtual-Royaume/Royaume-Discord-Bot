import { SlashCommandBuilder, SlashCommandStringOption } from "@discordjs/builders";
import { CommandInteraction, MessageButton, MessageActionRow } from "discord.js";
import { button } from "../../../resources/config/interaction-ids.json";
import { simpleEmbed } from "../../utils/Embed";
import Command from "../Command";

type InteractionType = "verif";

interface InteractionChoices {
    name: string;
    value: InteractionType;
}

export default class Interaction extends Command {

    private actionChoices: InteractionChoices[] = [
        { name: "Vérification", value: "verif" }
    ];

    public readonly slashCommand = new SlashCommandBuilder()
        .setName("interaction")
        .setDescription("Permet d'envoyer une interaction dans le salon")
        .addStringOption(new SlashCommandStringOption()
            .setName("name")
            .setDescription("Choisir l'interaction à envoyer.")
            .addChoices(...this.actionChoices)
            .setRequired(true));

    public async execute(command: CommandInteraction): Promise<void> {
        const interaction: InteractionType = <InteractionType>command.options.getString("name", true);

        switch (interaction) {
            case "verif": {
                const embed = simpleEmbed(
                    "Bienvenue, tu es dans le salon de vérification des nouveaux membres.\n\n"

                            + "**Le Royaume** est un serveur privé où la bonne ambiance est donc obligatoire. "
                            + "Ici on parle principalement de **programmation**, **trading**, **graphisme** "
                            + "et d'autres choses encore. Parfois on joue, ou on regarde des films ensemble aussi... 🍿\n\n"

                            + "Si les domaines cités ci-dessus te correspondent et que tu as envie de faire parti de "
                            + "cette communauté privée et d'évoluer avec nous, il faudra que tu fasses une petite présentation "
                            + "de toi, tes ambitions, tes projets, tes centres d'intérêt... Donne nous envie quoi !\n\n",

                    "normal",
                    "Vérification pour entrer dans le Royaume"
                );

                const row = new MessageActionRow().addComponents(new MessageButton()
                    .setCustomId(button.verify)
                    .setLabel("Faire sa présentation")
                    .setStyle("PRIMARY")
                    .setEmoji("📝"));

                await command.channel?.send({
                    embeds: [embed],
                    components: [row]
                });
                break;
            }
        }

        command.reply({ embeds: [simpleEmbed("Votre interaction a bien était créé.")], ephemeral: true });
    }
}