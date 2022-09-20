import { Collection } from "discord.js";
import Client from "$core/Client";
import Command from "$core/commands/Command";
import { readdirSync } from "fs";
import Logger from "$core/utils/Logger";

export default class CommandManager {

    public readonly commands: Collection<string, Command> = new Collection();

    constructor() {
        this.load().then(() => this.listener());
    }

    private async load() : Promise<void> {
        const files = readdirSync(`${__dirname}/list`).filter(file => file.endsWith(".ts") || file.endsWith(".js"));

        for (const file of files) {
            const dynamicImport = await import(`./list/${file}`);
            const command: Command = new dynamicImport.default();

            this.commands.set(command.name, command);
        }

        Logger.info(`${files.length} commands loaded`);
    }

    private async listener() : Promise<void> {
        Client.instance.on("interactionCreate", async interaction => {
            if (!interaction.isChatInputCommand()) return;

            const command = this.commands.get(interaction.commandName);

            if (command) command.execute(interaction);
        });
    }

    /**
     * Register the slash commands (use it when the client is ready)
     */
    public async register() : Promise<void> {
        await (await Client.instance.getGuild()).commands.set(
            this.commands.map(command => command.slashCommand.toJSON())
        );

        Logger.info("Successfully registered application (/) commands");
    }
}