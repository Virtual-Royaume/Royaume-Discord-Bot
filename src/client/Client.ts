import { Client as DiscordClient, Guild } from "discord.js";

import { createConnection, Connection } from "typeorm";
import { readFileSync } from "fs";

import EventManager from "../events/EventManager";
import CommandManager from "../commands/CommandManager";

import Logger from "./components/Logger";
import Embed from "./components/Embed";

import "reflect-metadata";

export default class Client extends DiscordClient {

    public static instance: Client;

    // Database connection :
    public readonly database: Connection;

    // Events and commands managers :
    public readonly eventManager: EventManager;
    public readonly commandManager: CommandManager;

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

        // Load events and commands managers :
        this.logger.info("Loading events...");
        this.eventManager = new EventManager();

        this.logger.info("Loading commands...");
        this.commandManager = new CommandManager();

        // Connect to database :
        this.logger.info("Connecting to mysql database...");
        createConnection().then(connection => (this as any).database = connection).catch(error => { throw new Error(error) });

        this.on("ready", () => {
            // Finish :
            this.logger.wow("The bot has been started !");
        });
    }

    public getGuild() : Guild {
        const guild: Guild|undefined = Client.instance.guilds.cache.first();

        if(guild instanceof Guild){
            return guild;
        } else {
            throw new Error("Unable to get the Guild instance");
        }
    }
}

(new Logger()).info("Sarting in progress...");
new Client();