import { Client as DiscordClient } from "discord.js";

import { readFileSync } from "fs";

import Constants from "../constants/Constants";

import EventMap from "../modules/EventMap";
import CommandMap from "../modules/CommandMap";

import Embed from "./components/Embed";

export default class Client extends DiscordClient {

    public static instance: Client;

    // Modules :
    public readonly eventMap: EventMap;
    public readonly commandMap: CommandMap;

    // Client components :
    public readonly embed: Embed;

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