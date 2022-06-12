import { SlashCommandBuilder, SlashCommandStringOption } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { request } from "../../api/Request";
import { setBirthday } from "../../api/requests/Member";
import { simpleEmbed } from "../../utils/Embed";
import Command from "../Command";
import { minimumAge } from "../../../resources/config/information.json";

export default class Birthday extends Command {

    public readonly slashCommand = new SlashCommandBuilder()
        .setName("anniversaire")
        .setDescription("Définir votre date d'anniversaire")
        .addStringOption(new SlashCommandStringOption()
            .setName("date")
            .setDescription("Votre date de naissance avec ce format : DD/MM/YYYY (jour/mois/année de naissance)")
            .setRequired(true));

    public readonly defaultPermission: boolean = true;

    public async execute(command: CommandInteraction) : Promise<void> {
        // Check parameter :
        const badFormat = (error: string) => {
            command.reply({ embeds: [simpleEmbed(error, "error")], ephemeral: true });
        };

        let dateParams: number[];

        try {
            dateParams = command.options.getString("date", true).split("/").map(element => parseInt(element));
        } catch {
            badFormat("Le format de votre date n'est pas bon.");
            return;
        }

        if (dateParams.length < 3) {
            badFormat("La date est incomplète.");
            return;
        }

        // Try to parse the date :
        const date = new Date(`${dateParams[2]}-${dateParams[1]}-${dateParams[0]}Z`);

        if (isNaN(date.getTime())) {
            badFormat("Cette date est invalide.");
            return;
        }

        if((new Date()).getFullYear() - date.getFullYear() < minimumAge ){
            badFormat(`Vous devez être né il y a minimum ${minimumAge} ans`);
            return;
        }

        // Save birthday :
        await request(setBirthday, { id: command.user.id, date: date.getTime() });

        command.reply({ embeds: [simpleEmbed("Votre date d'anniversaire a bien été enregistrée.")], ephemeral: true });
    }
}