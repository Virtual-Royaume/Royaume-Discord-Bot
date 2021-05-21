import {Collection, TextChannel} from "discord.js";

import Client from "../client/Client";

import ChannelIDs from "../constants/ChannelIDs";
import Constants from "../constants/Constants";

import Command from "./Command";

import { readdirSync } from "fs";
import path from "path";

export default class CommandManager {

    public readonly commands: Collection<string, Command> = new Collection();
    public readonly commandsAliases: Collection<string, Command> = new Collection();

    public readonly categories: string[] = [];

    public readonly categoriesWithCommands: Collection<string, Collection<string, Command>> = new Collection();

    constructor(){
        // Register commands automatically :
        readdirSync(path.join(__dirname, "list")).forEach(category => {
            let commandsOfCategory = readdirSync(path.join(__dirname, "list", category));

            commandsOfCategory.filter(file => file.endsWith(".ts")).forEach(commandFile => {
                const commandPath = path.join(__dirname, "list", category, commandFile);
                const command: Command = new (require(commandPath).default);

                // Save command instance by name :
                this.commands.set(command.name, command);

                // Save command instance by aliases :
                command.aliases.forEach(alias => this.commandsAliases.set(alias, command));

                // Check if the command category exist and add it if it does not exist :
                if(!this.categories.includes(command.category)){
                    this.categories.push(command.category)
                    this.categoriesWithCommands.set(command.category, new Collection<string, Command>());
                }

                // Add command instance in category :
                this.categoriesWithCommands.get(command.category)?.set(command.name, command);
            })
        });

        // Call commands methods :
        Client.instance.on("message", message => {
            if(!message.content.startsWith(Constants.commandPrefix)) return;
            if(message.content.length <= Constants.commandPrefix.length) return;

            if(message.channel.id !== ChannelIDs.command){
                Client.instance.embed.sendSimple(
                    "Vous ne pouvez pas faire de commande en dehors du salon <#" + ChannelIDs.command + ">.",
                    <TextChannel>message.channel
                );
                return;
            }

            const args: string[] = message.content.split(" ");
            const commandName: string|undefined = args.shift()?.substring(Constants.commandPrefix.length).toLowerCase();

            if(!commandName) return;

            let command = this.commands.get(commandName) || this.commandsAliases.get(commandName);

            if(command) command.run(args, message);
        });
    }
}