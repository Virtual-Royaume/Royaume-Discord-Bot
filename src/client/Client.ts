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
        this.logger = new Logger();
        this.embed = new Embed();

        // Connect to database :
        const ormConfig: string = require("../resources/configs/ormconfig.json");

        createConnection(ormConfig).then(connection => {
            (this as any).database = connection;

            this.logger.success("Successful connection to the database");
        }).catch(error => { throw new Error(error) });

        // Load events and commands managers :
        this.eventManager = new EventManager();
        this.logger.success("Events loaded"); // TODO: add event count and list

        this.commandManager = new CommandManager();
        this.logger.success("Commands loaded"); // TODO: add commands count and list

        this.on("ready", () => {
            // Set activity :
            this.user?.setActivity("royaume.world", {type: "WATCHING"});
            
            // Finish :
            this.logger.success("Client has been started");
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

(new Logger()).info("Sarting in progress (events, commands, database connection and client)...");
new Client();