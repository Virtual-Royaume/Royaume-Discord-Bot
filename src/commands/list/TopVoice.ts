import { SlashCommandBuilder, SlashCommandNumberOption } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { request } from "../../api/Request";
import { getVoiceTime } from "../../api/requests/Member";
import { Member } from "../../api/Schema";
import { simpleEmbed } from "../../utils/Embed";
import { numberParser } from "../../utils/Func";
import Command from "../Command";

export default class TopVoice extends Command {

    public readonly slashCommand = new SlashCommandBuilder()
        .setName("top-voice")
        .setDescription("Voir le classement des membres les plus actifs en vocal")
        .addNumberOption(new SlashCommandNumberOption()
            .setName("page")
            .setDescription("Page du classement")
            .setMinValue(1)
        );

    public readonly defaultPermission: boolean = true;

    private memberPerPage = 20;

    public async execute(command: CommandInteraction) : Promise<void> {
        // Get data and sort it :
        let members = (await request<{ members: Member[] }>(getVoiceTime)).members.sort((a, b) => {
            return (b?.activity.voiceMinute ?? 0) - (a?.activity.voiceMinute ?? 0);
        });

        // Get page and max page :
        const maxPage = Math.ceil(members.length / this.memberPerPage);
        let page = command.options.getNumber("page") ?? 1;
        page = page > maxPage ? maxPage : page;

        // Slice the members with page and max page :
        members = members.slice(page * this.memberPerPage - this.memberPerPage, page * this.memberPerPage);

        // Format leaderboard :
        let message = "";

        for(let i = 0; i < members.length; i++){
            const member = members[i];

            message += `**${(i + 1 + (page - 1) * this.memberPerPage)}. ${member.username} :** ${ numberParser(member.activity.voiceMinute)}\n`;
        }

        // Send leaderboard :
        command.reply({
            embeds: [simpleEmbed(message, "normal", `Classements des membres les plus actifs en vocal (en minute) (page : ${page}/${maxPage})`)]
        });
    }
}