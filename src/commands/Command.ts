import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from "discord.js";

export default abstract class Command {

    public abstract readonly slashCommand: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup"> | SlashCommandSubcommandsOnlyBuilder;

    public abstract readonly enabledInDev: boolean;

    get name(): string {
      return this.slashCommand.name;
    }

    get description(): string {
      return this.slashCommand.description;
    }

    public abstract execute(command: ChatInputCommandInteraction): void;

}