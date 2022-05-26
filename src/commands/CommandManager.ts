import { Collection } from "discord.js";
import Client from "../Client";
import Command from "./Command";
import { readdirSync } from "fs";
import Logger from "../utils/Logger";

export default class CommandManager {

    public readonly commands: Collection<string, Command> = new Collection();

    constructor(){
        this.load().then(() => this.listener());
    }

    private async load() : Promise<void> {
        const files = readdirSync(`${__dirname}/list`).filter(file => file.endsWith(".ts") || file.endsWith(".js"));

        for(const file of files){
            const dynamicImport = await import (`./list/${file}`);
            const command: Command = new dynamicImport.default;

            this.commands.set(command.name, command);
        }

        Logger.info(`${files.length} commands loaded`);
    }

    private async listener() : Promise<void> {
        Client.instance.on("interactionCreate", async interaction => {
            if(!interaction.isCommand()) return;

            const command = this.commands.get(interaction.commandName);

            if(command) command.execute(interaction);
        });
    }

    /**
     * Register the slash commands (use it when the client is ready)
     */
    public async register() : Promise<void> {
        // Get command data :
        const commands = this.commands.map(command => {
            return command.slashCommand.setDefaultPermission(command.defaultPermission).toJSON()
        });

        // Set commands :
        // @ts-ignore : DJS - DJS/builders typing version problem
        await (await Client.instance.getGuild()).commands.set(commands);

        Logger.info("Successfully registered application (/) commands");
    }
}