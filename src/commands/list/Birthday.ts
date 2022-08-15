import { SlashCommandBuilder, SlashCommandNumberOption, SlashCommandStringOption, SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { request } from "../../api/Request";
import { getBirthdays, GetBirthdaysType, setBirthday } from "../../api/requests/Member";
import { simpleEmbed } from "../../utils/Embed";
import Command from "../Command";
import { minimumAge } from "../../../resources/config/information.json";
import { dateFormat, getAge } from "../../utils/Function";
import DayJS from "../../utils/DayJS";
import { msg } from "../../utils/Message";

export default class Birthday extends Command {

    public readonly slashCommand = new SlashCommandBuilder()
        .setName(msg("cmd-birthday-builder-name"))
        .setDescription(msg("cmd-birthday-builder-description"))
        .addSubcommand(new SlashCommandSubcommandBuilder()
            .setName(msg("cmd-birthday-builder-subcmd-set-name"))
            .setDescription(msg("cmd-birthday-builder-subcmd-set-description"))
            .addStringOption(new SlashCommandStringOption()
                .setName(msg("cmd-birthday-builder-subcmd-set-date-name"))
                .setDescription(msg("cmd-birthday-builder-subcmd-set-date-description"))
                .setRequired(true)))
        .addSubcommand(new SlashCommandSubcommandBuilder()
            .setName(msg("cmd-birthday-builder-subcmd-list-name"))
            .setDescription(msg("cmd-birthday-builder-subcmd-list-description"))
            .addNumberOption(new SlashCommandNumberOption()
                .setName(msg("cmd-birthday-builder-subcmd-list-number-name"))
                .setDescription(msg("cmd-birthday-builder-subcmd-list-number-description"))
                .setMinValue(1)));

    private memberPerPage = 10;

    public async execute(command: CommandInteraction): Promise<void> {

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

                let msg = "";

                for (let i = 0; i < birthdays.length; i++) {
                    const member = birthdays[i];
                    const birthday = DayJS(member.birthday ?? 0);
                    const position = i + 1 + (page - 1) * this.memberPerPage;

                    msg += `**${position}. ${member.username} :** ${getAge(birthday)} ans (${dateFormat(birthday, "/")})\n`;
                }

                // Send leaderboard :
                command.reply({
                    embeds: [simpleEmbed(msg, "normal", `Anniversaires des membres (page ${page}/${maxPage})`)]
                });

                break;
            }
        }
    }
}