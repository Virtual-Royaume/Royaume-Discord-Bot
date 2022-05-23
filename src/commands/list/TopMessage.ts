import { SlashCommandBuilder, SlashCommandChannelOption, SlashCommandNumberOption, SlashCommandStringOption } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { ChannelTypes } from "discord.js/typings/enums";
import { leaderboardEmbed, LeaderboardOptionsType, simpleEmbed } from "../../utils/Embed";
import Command from "../Command";

type Source = "total" | "month";

interface SourceChoice {
	name: string;
	value: Source;
}

export default class TopMessage extends Command {

    private sourceChoices: SourceChoice[] = [
        { name: "Total", value: "total" },
		{ name: "Mois", value: "month" }
	];

    public readonly slashCommand = new SlashCommandBuilder()
        .setName("top-message")
        .setDescription("Voir le classement des membres les plus actifs en terme de nombre de message")
        .addStringOption(new SlashCommandStringOption()
            .setName("source")
            .setDescription("Source du classement")
            .addChoices(...this.sourceChoices)
            .setRequired(true)
        ).addNumberOption(new SlashCommandNumberOption()
            .setName("page")
            .setDescription("Page du classement")
            .setMinValue(1)
        ).addChannelOption(new SlashCommandChannelOption()
            .setName("salon")
            .setDescription("Choix du salon si vous avez choisi \"salon\" comme source")
            // @ts-ignore : DJS - DJS/builders typing version problem
			.addChannelTypes(ChannelTypes.GUILD_TEXT)
        );

    public readonly defaultPermission: boolean = true;

    public async execute(command: CommandInteraction) : Promise<void> {
        
        const source: Source = <Source>command.options.getString("source", true);
        const page = command.options.getNumber("page") ?? 1;

        const options: LeaderboardOptionsType = {
            period: source === "month" ? "month" : undefined,
            channel: command.options.getChannel("salon")?.id
        }
        
        const embed = await leaderboardEmbed("message", page, options);

        command.reply( {embeds: [embed]} );
    }
}