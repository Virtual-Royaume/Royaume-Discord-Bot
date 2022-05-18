import {Collection, Permissions, TextChannel} from "discord.js";

import Client from "../client/Client";

import { TextChannel as TC } from "../constants/ChannelID";
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
            if(!message.content.match(new RegExp("^\\" + Constants.commandPrefix + "[a-z]"))) return;
            if(message.content.length <= Constants.commandPrefix.length) return;
            if(!(message.channel instanceof TextChannel)) return;

            // Get args and command name in variable :
            const args: string[] = message.content.split(" ");
            const commandName: string|undefined = args.shift()?.substring(Constants.commandPrefix.length).toLowerCase();

            if(!commandName) return;

            // Get command instance if it exist :
            const command = this.commands.get(commandName) || this.commandsAliases.get(commandName);

            // If the command exists, check arguments, channel and permissions then run the command :
            if(command){
                // Checks if command is executed from an allowed channel :
                if(command.additionalParams.allowedChannels && command.additionalParams.allowedChannels.length){
                    if(
                        command.additionalParams.allowedChannels !== "EVERY" &&
                        !command.additionalParams.allowedChannels.includes(message.channel.id as TC)
                    ){
                        Client.instance.embed.sendSimple(
                            "Vous ne pouvez pas exécuter cette commande dans ce salon. Salon(s) autorisé(s) : " + 
                            command.additionalParams.allowedChannels.map(element => "<#" + element.toString() + ">").join(", ") + ".",

                            <TextChannel>message.channel
                        );

                        return;
                    }
                } else if(message.channel.id !== TC.commandes){
                    Client.instance.embed.sendSimple(
                        "Vous ne pouvez pas exécuter cette commande en dehors du salon <#" + TC.commandes + ">.",
                        <TextChannel>message.channel
                    );

                    return;
                }

                // Checks if required arguments are provided, if any :
                if(command.additionalParams.usage && command.additionalParams.usage.length){
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
                if(command.additionalParams.permissions && command.additionalParams.permissions.length){
                    const admins = await Client.instance.getDevTeam();
                    const member = message.member;

                    if(!member){
                        Client.instance.embed.sendSimple("Erreur lors de l'excution de la commande...", <TextChannel>message.channel);
                        Client.instance.logger.warning("Unable to retrieve the member instance in the command permissions check of the " + this.constructor.name + " class.")
                        return;
                    }

                    const hasPermission: boolean = command.additionalParams.permissions.every(permission => {
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
                        Client.instance.embed.sendSimple(
                            "Vous n'avez pas la permission d'utiliser cette commande. Permissions requises : " + command.additionalParams.permissions.join(", ") + ".",
                            <TextChannel>message.channel
                        );
                    }
                } else {
                    command.run(args, message);
                }
            } else {
                Client.instance.embed.sendSimple(
                    "Cette commande n'existe pas, faites ``" + Constants.commandPrefix + "help`` pour voir la liste des commandes existantes.",
                    <TextChannel>message.channel
                ); 
            }
        });
    }
}