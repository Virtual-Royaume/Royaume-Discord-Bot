import { SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

export default abstract class Command {

    public abstract readonly slashCommand: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup"> | SlashCommandSubcommandsOnlyBuilder;

    public abstract readonly defaultPermission: boolean;

    get name(): string {
        return this.slashCommand.name;
    }

    get description(): string {
        return this.slashCommand.description;
    }

    public abstract execute(command: CommandInteraction): void;
}