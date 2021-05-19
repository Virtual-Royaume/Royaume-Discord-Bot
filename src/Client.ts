import * as discord from "discord.js";
import { readFileSync } from "fs";

import Constants from "./constants/Constants";

import EventMap from "./modules/EventMap";
import CommandMap from "./modules/CommandMap";

export default class Client {

    public static instance: discord.Client;

    public eventMap: EventMap|null = null;
    public commandMap: CommandMap|null = null;

    constructor(){
        // Create bot instance and login it :
        Client.instance = new discord.Client();
        Client.instance.login(readFileSync(__dirname + "/resources/token.txt", {encoding: "utf-8"}));

        Client.instance.on("ready", () => {
            // Load events :
            console.log(Constants.prefix + "Loading events...");
            this.eventMap = new EventMap();

            //Load commands :
            console.log(Constants.prefix + "Loading commands...");
            this.commandMap = new CommandMap();

            // Finish :
            console.log(Constants.prefix + "The bot has been started !");
        });
    }

    public sendSimpleEmbed(message: string, channel: discord.TextChannel|discord.DMChannel){
        let embed = new discord.MessageEmbed();

        embed.setColor(Constants.color);
        embed.setDescription(message);        

        channel.send(embed);
    }
}

console.log(Constants.prefix + "Sarting in progress...");
new Client();