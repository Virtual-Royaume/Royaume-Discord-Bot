import { msg } from "$core/utils/Message";
import {
    ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandNumberOption,
    SlashCommandStringOption, SlashCommandSubcommandBuilder
} from "discord.js";
import { getBirthdays, GetBirthdaysType, setBirthday } from "$core/api/requests/Member";
import { simpleEmbed } from "$core/utils/Embed";
import Command from "$core/commands/Command";
import { minimumAge } from "$resources/config/information.json";
import { dateFormat, getAge } from "$core/utils/Function";
import DayJS from "$core/utils/DayJS";
import { gqlRequest } from "$core/utils/Request";

export default class Birthday extends Command {

    public readonly slashCommand = new SlashCommandBuilder()
        .setName(msg("cmd-birthday-builder-name"))
        .setDescription(msg("cmd-birthday-builder-description"))
        .addSubcommand(new SlashCommandSubcommandBuilder()
            .setName("set")
            .setDescription(msg("cmd-birthday-builder-subcmd-set-description"))
            .addStringOption(new SlashCommandStringOption()
                .setName(msg("cmd-birthday-builder-subcmd-set-date-name"))
                .setDescription(msg("cmd-birthday-builder-subcmd-set-date-description"))
                .setRequired(true)))
        .addSubcommand(new SlashCommandSubcommandBuilder()
            .setName("list")
            .setDescription(msg("cmd-birthday-builder-subcmd-list-description"))
            .addNumberOption(new SlashCommandNumberOption()
                .setName(msg("cmd-birthday-builder-subcmd-list-number-name"))
                .setDescription(msg("cmd-birthday-builder-subcmd-list-number-description"))
                .setMinValue(1)))
        .addSubcommand(new SlashCommandSubcommandBuilder()
            .setName("next")
            .setDescription(msg("cmd-birthday-builder-subcmd-next-description")));

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
                    badFormat(msg("cmd-birthday-exec-badformat"));
                    return;
                }

                if (dateParams.length < 3) {
                    badFormat(msg("cmd-birthday-exec-date-incomplete"));
                    return;
                }

                // Try to parse the date :
                const date = DayJS(`${dateParams[2]}-${dateParams[1]}-${dateParams[0]}Z`);

                if (!date.isValid()) {
                    badFormat(msg("cmd-birthday-exec-date-invalid"));
                    return;
                }

                if (getAge(date) < minimumAge) {
                    badFormat(msg("cmd-birthday-exec-date-too-young", [minimumAge]));
                    return;
                }

                // Save birthday :
                const response = await gqlRequest(setBirthday, { id: command.user.id, date: date.valueOf() });

                if (!response.success) {
                    command.reply({ embeds: [simpleEmbed(msg("message-execution-error-cmd"), "error")] });
                    return;
                }

                command.reply({ embeds: [simpleEmbed(msg("cmd-birthday-exec-date-saved"))], ephemeral: true });
                break;
            }

            case "list": {
                let page = command.options.getNumber("page") ?? 1;
                let birthdays = (await gqlRequest<GetBirthdaysType, undefined>(getBirthdays)).data?.members.filter(member => member.birthday)
                    .sort((a, b) => (a.birthday ?? 0) - (b.birthday ?? 0));

                if (!birthdays) {
                    command.reply({ embeds: [simpleEmbed(msg("message-execution-error-cmd"), "error")] });
                    return;
                }

                if (!birthdays.length) {
                    command.reply({ embeds: [simpleEmbed(msg("cmd-birthday-exec-empty-birthday-list"), "error")] });
                    return;
                }

                const maxPage = Math.ceil(birthdays.length / this.memberPerPage);
                page = page > maxPage ? maxPage : page;

                // Slice the members with page and max page :
                birthdays = birthdays.slice(page * this.memberPerPage - this.memberPerPage, page * this.memberPerPage);

                let lines = "";

                for (let i = 0; i < birthdays.length; i++) {
                    const member = birthdays[i];
                    const birthday = DayJS(member.birthday ?? 0);
                    const position = i + 1 + (page - 1) * this.memberPerPage;

                    lines += msg("cmd-birthday-exec-embed-line", [position, member.username, getAge(birthday), dateFormat(birthday)]);
                }

                // Send leaderboard :
                command.reply({
                    embeds: [simpleEmbed(lines, "normal", msg("cmd-birthday-exec-embed-title", [page, maxPage]))]
                });

                break;
            }

            case "next": {
                // Get members with their dates of birth from API :
                const response = await gqlRequest<GetBirthdaysType, undefined>(getBirthdays);

                // Checking the success of the request to the API :
                if (!response.success || !response.data.members.length) {
                    command.reply({ embeds: [simpleEmbed(msg("Erreur lors de l'obtention de la liste des anniversaires."), "error")] });
                    return;
                }

                // Save birth dates as record with the member ID :
                const birthDates = [...response.data.members.map(member => ({ ...member }))];

                // Remove not defined birthdays and transform birth date to birtday :
                const birthdays = response.data.members.filter(member => member.birthday).map(member => {
                    member.birthday = DayJS(member.birthday).set(
                        "year", DayJS().year() + (DayJS().valueOf() > DayJS(member.birthday).set("year", DayJS().year()).valueOf() ? 1 : 0)
                    ).valueOf();

                    return member;
                });

                // Get the next birthday :
                const nextBirthday = birthdays.slice(1).reduce((pre, curr) => {
                    return DayJS(curr.birthday).isBefore(DayJS(pre.birthday)) ? curr : pre;
                }, birthdays[0]);

                // Format and send message of the next birthday :
                const message = msg(
                    "cmd-birthday-exec-next-birthday",
                    [
                        nextBirthday.username,
                        DayJS(nextBirthday.birthday).format("DD/MM"),
                        DayJS().diff(DayJS(birthDates.find(member => member._id === nextBirthday._id)?.birthday), "year")
                    ]
                );

                command.reply({ embeds: [simpleEmbed(message)] });
            }
        }
    }
}