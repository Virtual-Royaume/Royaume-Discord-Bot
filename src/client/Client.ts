import { TextChannel, DMChannel, MessageEmbed } from "discord.js";
import { Client as DiscordClient } from "discord.js";

import { readFileSync } from "fs";

import Constants from "./constants/Constants";

import EventMap from "./modules/EventMap";
import CommandMap from "./modules/CommandMap";

export default class Client extends DiscordClient {

    public static instance: Client;

    public eventMap: EventMap|null = null;
    public commandMap: CommandMap|null = null;

    constructor(){
        super();

        // Create bot instance and login it :
        Client.instance = this;
        this.login(readFileSync(__dirname + "/resources/token.txt", {encoding: "utf-8"}));

        // Load client components :
        console.log(Constants.prefix + "Loading client components...");
        this.embed = new Embed();

        // Load events :
        console.log(Constants.prefix + "Loading events...");
        this.eventMap = new EventMap();

        //Load commands :
        console.log(Constants.prefix + "Loading commands...");
        this.commandMap = new CommandMap();

        this.on("ready", () => {
            // Finish :
            console.log(Constants.prefix + "The bot has been started !");
        });
    }
}

console.log(Constants.prefix + "Sarting in progress...");
new Client();