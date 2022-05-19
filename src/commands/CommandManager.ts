import { Collection } from "discord.js";
import Client from "../Client";
import Command from "./Command";
import { readdirSync } from "fs";

export default class CommandManager {

    public readonly commands: Collection<string, Command> = new Collection();

    constructor(){
        this.load().then(() => this.commandListener());
    }

    private async load() : Promise<void> {
        for(const file of readdirSync(`${__dirname}/list`).filter(file => file.endsWith(".ts"))){
            const dynamicImport = await import (`./list/${file}`);
            const command: Command = new dynamicImport.default;

            this.commands.set(command.name, command);
        }
    }

    private async commandListener() : Promise<void> {
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
        // TODO : register the slashs commands
    }
}