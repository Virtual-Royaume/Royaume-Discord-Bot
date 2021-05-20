import { Client as DiscordClient } from "discord.js";

import { createConnection, Connection } from "typeorm";
import { readFileSync } from "fs";

import Constants from "../constants/Constants";

import EventMap from "../modules/EventMap";
import CommandMap from "../modules/CommandMap";

import Logger from "./components/Logger";
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
    public readonly logger: Logger;
    public readonly embed: Embed;

    constructor(){
        super();

        // Create bot instance and login it :
        Client.instance = this;
        this.login(readFileSync(__dirname + "/../resources/token.txt", {encoding: "utf-8"}));

        // Load client components :
        (new Logger().info("Loading client components..."));
        this.logger = new Logger();
        this.embed = new Embed();

        // Load events :
        this.logger.info("Loading events...");
        this.eventMap = new EventMap();

        //Load commands :
        this.logger.info("Loading commands...");
        this.commandMap = new CommandMap();

        // Connect to database :
        this.logger.info("Connecting to mysql database...");
        createConnection().then(connection => (this as any).database = connection).catch(error => { throw new Error(error) });

        this.on("ready", () => {
            // Finish :
            this.logger.wow("The bot has been started !");
        });
    }
}

(new Logger()).info("Sarting in progress...");
new Client();