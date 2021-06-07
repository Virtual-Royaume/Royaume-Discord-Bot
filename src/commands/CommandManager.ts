import {Collection, Permissions, TextChannel} from "discord.js";

import Client from "../client/Client";

import ChannelIDs from "../constants/ChannelIDs";
import Constants from "../constants/Constants";

import Command from "./Command";

import { readdirSync } from "fs";
import path from "path";

export default class CommandManager {

    public readonly commands: Collection<string, Command> = new Collection();
    public readonly commandsAliases: Collection<string, Command> = new Collection();
    public readonly categoriesWithCommands: Collection<string, Collection<string, Command>> = new Collection();

    public readonly categories: string[] = [];

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
                if(command.additionalParams.aliases){
                    command.additionalParams.aliases.forEach(alias => {
                        if(this.commandsAliases.get(alias)){
                            Client.instance.logger.warning("Registering \"" + alias + "\" alias for \"" + command.name + "\" command is impossible because this alias is already used for the \"" + this.commandsAliases.get(alias)?.name + "\" command");
                        } else {
                            this.commandsAliases.set(alias, command);
                        }
                    });
                }

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
        Client.instance.on("message", async message => {
            if(!message.content.startsWith(Constants.commandPrefix)) return;
            if(message.content.length <= Constants.commandPrefix.length) return;
            if(!(message.channel instanceof TextChannel)) return;

            // Check if the order is executed in the command channel :
            // @ts-ignore : TODO remove this (djs v13 master problem)
            /*if(message.channel.id !== ChannelIDs.command){
                Client.instance.embed.sendSimple(
                    "Vous ne pouvez pas faire de commande en dehors du salon <#" + ChannelIDs.command + ">.",
                    <TextChannel>message.channel
                );
                return;
            }*/

            // Get args and command name in variable :
            const args: string[] = message.content.split(" ");
            const commandName: string|undefined = args.shift()?.substring(Constants.commandPrefix.length).toLowerCase();

            if(!commandName) return;

            // Get command instance if it exist :
            const command = this.commands.get(commandName) || this.commandsAliases.get(commandName);

            // If the command exists, check arguments and permissions then run the command :
            if(command){
                // Checks if required arguments are provided, if any :
                if(command.additionalParams.usage && command.additionalParams.usage.length > 0){
                    const hasRequiredArgs = command.additionalParams.usage.every((usageParam, index) => {
                        if(usageParam.type === "required"){
                            return args.length > index;
                        } else return true;
                    });

                    if(!hasRequiredArgs){
                        Client.instance.embed.sendSimple(
                            command.getFormattedUsage(),
                            <TextChannel> message.channel
                        );
                        
                        return;
                    }
                }

                //Checks if permissions are met, if any
                if(command.additionalParams.permissions && command.additionalParams.permissions.length > 0){
                    const admins = await Client.instance.getAdmins();
                    const member = message.member;

                    if(!member){
                        Client.instance.embed.sendSimple("Erreur lors de l'excution de la commande...", <TextChannel>message.channel);
                        Client.instance.logger.warning("Unable to retrieve the member instance in the command permissions check of the " + this.constructor.name + " class.")
                        return;
                    }

                    let hasPermission: boolean = command.additionalParams.permissions.every(permission => {
                        if(permission === "TEAM_ADMIN"){
                            if(admins){
                                return admins.get(member.id);
                            } else {
                                Client.instance.logger.warning("Unable to get the list of bot admins, the check of the \"TEAM_ADMIN\" command permission failed in the " + this.constructor.name + " class");

                                return false;
                            }
                        } else {
                            return member.permissions.has(Permissions.FLAGS[permission]);
                        }
                    });

                    if(hasPermission){
                        command.run(args, message);
                    } else {
                        Client.instance.embed.sendSimple("Vous n'avez pas la permission d'utiliser cette commande. Permissions requises : " + command.additionalParams.permissions.join(", ") + ".", <TextChannel>message.channel);
                    }
                } else {
                    command.run(args, message);
                }
            }
        });
    }
}