import { SlashCommandBuilder, SlashCommandNumberOption } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { request } from "../../api/Request";
import { getVoiceTime } from "../../api/requests/Member";
import { Member } from "../../api/Schema";
import { leaderboardEmbed, simpleEmbed } from "../../utils/Embed";
import { numberFormat } from "../../utils/Func";
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

    public async execute(command: CommandInteraction) : Promise<void> {
        
        const page = command.options.getNumber("page") ?? 1;
        
        const embed = await leaderboardEmbed("voice", page);

        command.reply( {embeds: [embed]} );
    }
}