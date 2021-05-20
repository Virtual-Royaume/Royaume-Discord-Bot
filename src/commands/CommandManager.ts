import {Collection, TextChannel} from "discord.js";

import Client from "../client/Client";

import ChannelIDs from "../constants/ChannelIDs";
import Constants from "../constants/Constants";

import Command from "./Command";

import Accept from "./list/admin/Accept";
import Role from "./list/utils/Role";

import {readdir} from "fs";
import path from 'path';

export default class CommandManager {

    // public readonly commands: {[key: string]: Command} = {};
    public readonly commands: Collection<string, Command> = new Collection();
    public readonly aliases: Collection<string, Command> = new Collection();
    public readonly categories: string[] = [];
    public readonly categoriesWithCommands: Collection<string, Collection<string, Command>> = new Collection();

    constructor() {
        // Registers commands (TODO : auto load) :
        // this.commands["accept"] = new Accept();
        // this.commands["role"] = new Role();

        // Register commands automatically
        Client.instance.logger.info(`=-=-=-=-=-=-=- Loading command(s) -=-=-=-=-=-=-=`);
        readdir(path.join(__dirname, 'list'), (err, categories) => {
            categories.forEach((category) => {

                readdir(path.join(__dirname, 'list', category), (err, commands) => {
                    commands.filter(files => files.endsWith('.ts')).forEach((cmd) => {
                        this.loadCommand(path.join(__dirname, 'list', category), cmd, category);
                    })
                })
            })
        })

        // Call commands methods :
        Client.instance.on("message", message => {
            if (!message.content.startsWith(Constants.commandPrefix)) return;
            if (message.content.length <= Constants.commandPrefix.length) return;

            if (message.channel.id !== ChannelIDs.command) {
                Client.instance.embed.sendSimple(
                    "Vous ne pouvez pas faire de commande en dehors du salon <#" + ChannelIDs.command + ">.",
                    <TextChannel>message.channel
                );
                return;
            }

            let args: string[] = message.content.split(" ");
            let commandString = args.shift()?.substring(Constants.commandPrefix.length).toLowerCase();
            // @ts-ignore
            let command =  this.getCommandByName(commandString) || this.getCommandByAlias(commandString);

            if (command) {
                command.run(args, message)
            }
        });
    }

    public getCommandByName(commandName: string) : Command | undefined | null {
        return typeof this.commands.get(commandName) !== "undefined" ? this.commands.get(commandName) : null;
    }

    public getCommandByAlias(commandName: string) : Command | undefined | null {
        return typeof this.aliases.get(commandName) !== "undefined" ? this.aliases.get(commandName) : null;
    }

    private loadCommand(commandPath: string, commandName: string, commandCategory: string): void {
        try {
            const cmd: Command = new (require(`${commandPath}${path.sep}${commandName}`).default);
            this.commands.set(cmd.getName(), cmd)
            Client.instance.logger.info(`Command ${cmd.getName()} has been loaded !`)
            // @ts-ignore
            if (cmd.getOptions().aliases) {
                // @ts-ignore
                cmd.getOptions().aliases.forEach(alias => {
                    this.aliases.set(alias, cmd)
                })
            }

            if (!this.categories.includes(commandCategory)) {
                this.categories.push(commandCategory)
                this.categoriesWithCommands.set(commandCategory, new Collection<string, Command>())
            }

            // @ts-ignore
            this.categoriesWithCommands.get(commandCategory).set(cmd.getName(), cmd);

        } catch (e) {
            Client.instance.logger.error(`Error: ${e}`)
        }
    }
}