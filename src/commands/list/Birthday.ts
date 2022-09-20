import { SlashCommandBuilder, SlashCommandNumberOption, SlashCommandStringOption, SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction } from "discord.js";
import { request } from "$core/api/Request";
import { getBirthdays, GetBirthdaysType, setBirthday } from "$core/api/requests/Member";
import { simpleEmbed } from "$core/utils/Embed";
import Command from "$core/commands/Command";
import { minimumAge } from "$resources/config/information.json";
import { dateFormat, getAge } from "$core/utils/Function";
import DayJS from "$core/utils/DayJS";

export default class Birthday extends Command {

    public readonly slashCommand = new SlashCommandBuilder()
        .setName("anniversaire")
        .setDescription("Définir votre date d'anniversaire")
        .addSubcommand(new SlashCommandSubcommandBuilder()
            .setName("set")
            .setDescription("Définir votre date d'anniversaire")
            .addStringOption(new SlashCommandStringOption()
                .setName("date")
                .setDescription("Votre date de naissance avec ce format : DD/MM/YYYY (jour/mois/année de naissance)")
                .setRequired(true)))
        .addSubcommand(new SlashCommandSubcommandBuilder()
            .setName("list")
            .setDescription("Afficher la liste des anniversaires")
            .addNumberOption(new SlashCommandNumberOption()
                .setName("page")
                .setDescription("Page de la liste")
                .setMinValue(1)));

    private memberPerPage = 10;

    public async execute(command: ChatInputCommandInteraction): Promise<void> {
        switch (command.options.getSubcommand()) {
            case "set": {
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
                const date = DayJS(`${dateParams[2]}-${dateParams[1]}-${dateParams[0]}Z`);

                if (!date.isValid()) {
                    badFormat("Cette date est invalide.");
                    return;
                }

                if (getAge(date) < minimumAge) {
                    badFormat(`L'age minimum requis est de ${minimumAge} ans.`);
                    return;
                }

                // Save birthday :
                await request(setBirthday, { id: command.user.id, date: date.valueOf() });

                command.reply({ embeds: [simpleEmbed("Votre date d'anniversaire a bien été enregistrée.")], ephemeral: true });
                break;
            }

            case "list": {
                let page = command.options.getNumber("page") ?? 1;
                let birthdays = (await request<GetBirthdaysType>(getBirthdays)).members.filter(member => member.birthday)
                    .sort((a, b) => (a.birthday ?? 0) - (b.birthday ?? 0));

                const maxPage = Math.ceil(birthdays.length / this.memberPerPage);
                page = page > maxPage ? maxPage : page;

                // Slice the members with page and max page :
                birthdays = birthdays.slice(page * this.memberPerPage - this.memberPerPage, page * this.memberPerPage);

                let message = "";

                for (let i = 0; i < birthdays.length; i++) {
                    const member = birthdays[i];
                    const birthday = DayJS(member.birthday ?? 0);
                    const position = i + 1 + (page - 1) * this.memberPerPage;

                    message += `**${position}. ${member.username} :** ${getAge(birthday)} ans (${dateFormat(birthday, "/")})\n`;
                }

                // Send leaderboard :
                command.reply({
                    embeds: [simpleEmbed(message, "normal", `Anniversaires des membres (page ${page}/${maxPage})`)]
                });

                break;
            }
        }
    }
}