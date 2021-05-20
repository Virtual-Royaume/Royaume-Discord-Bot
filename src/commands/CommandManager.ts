import { TextChannel } from "discord.js";

import Client from "../client/Client";

import ChannelIDs from "../constants/ChannelIDs";
import Constants from "../constants/Constants";

import Command from "./Command";

import Accept from "./list/admin/Accept";
import Role from "./list/utils/Role";

export default class CommandManager {

    public readonly commands: {[key: string]: Command} = {};
    
    constructor(){
        // Registers commands (TODO : auto load) :
        this.commands["accept"] = new Accept();
        this.commands["role"] = new Role();

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

            let args: string[] = message.content.split(" ");
            let command = args.shift()?.substring(Constants.commandPrefix.length).toLowerCase();

            if(command && Object.keys(this.commands).includes(command)){
                this.commands[command].run(args, message);
            }
        });
    }
}