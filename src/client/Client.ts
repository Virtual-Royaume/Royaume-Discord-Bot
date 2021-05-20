import { Client as DiscordClient } from "discord.js";

import { createConnection, Connection } from "typeorm";
import { readFileSync } from "fs";

import Constants from "../constants/Constants";

import EventMap from "../modules/EventMap";
import CommandMap from "../modules/CommandMap";

import Embed from "./components/Embed";

import "reflect-metadata";

export default class Client extends DiscordClient {

    public static instance: Client;

    // Database connection :
    // @ts-ignore
    public readonly database: Connection|null;

    // Modules :
    public readonly eventMap: EventMap;
    public readonly commandMap: CommandMap;

    // Client components :
    public readonly embed: Embed;

    constructor(){
        super();

        // Create bot instance and login it :
        Client.instance = this;
        this.login(readFileSync(__dirname + "/../resources/token.txt", {encoding: "utf-8"}));

        // Connect to database :
        console.log(Constants.prefix + "Connecting to mysql database...");
        createConnection().then(connection => (this as any).database = connection).catch(error => { throw new Error(error) });

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