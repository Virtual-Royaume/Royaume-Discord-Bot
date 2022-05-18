import { SlashCommandBuilder } from "@discordjs/builders";
import { ApplicationCommandPermissionData, CommandInteraction, Message } from "discord.js";

export default abstract class Command {

    public abstract readonly slashCommand: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
    public readonly permissions: ApplicationCommandPermissionData[] = [];

    get name() : string {
        return this.slashCommand.name;
    }

    get description() : string {
        return this.slashCommand.description;
    }

    public abstract execute(command: CommandInteraction) : void;
}