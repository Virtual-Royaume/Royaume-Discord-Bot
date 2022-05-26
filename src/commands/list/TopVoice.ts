import { SlashCommandBuilder, SlashCommandNumberOption } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { leaderboardEmbed } from "../../utils/Embed";
import { getVoiceLeaderboard } from "../../utils/Func";
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
        
        const leaderboard = await getVoiceLeaderboard();
        const embed = leaderboardEmbed("Classements des membres les plus actifs en vocal *(en minute)*", leaderboard, page);

        command.reply( {embeds: [embed]} );
    }
}