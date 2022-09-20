import { SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction } from "discord.js";

export default abstract class Command {

    public abstract readonly slashCommand: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup"> | SlashCommandSubcommandsOnlyBuilder;

    get name(): string {
        return this.slashCommand.name;
    }

    get description(): string {
        return this.slashCommand.description;
    }

    public abstract execute(command: ChatInputCommandInteraction): void;
}