import { Client as DiscordClient, Collection, Guild, Intents, Team, TeamMember, User } from "discord.js";

import { readFileSync } from "fs";

import EventManager from "../events/EventManager";
import CommandManager from "../commands/CommandManager";
import TaskManager from "../tasks/TaskManager";

import Logger from "./components/Logger";
import Embed from "./components/Embed";

export default class Client extends DiscordClient {

    public static instance: Client;

    // Events and commands managers :
    public readonly eventManager: EventManager;
    public readonly commandManager: CommandManager;
    public readonly taskManager: TaskManager;

    // Client components :
    public readonly logger: Logger;
    public readonly embed: Embed;

    // Resources folder :
    public readonly resources: string;

    constructor(){
        super({
            intents: [Intents.FLAGS.GUILDS]
        });

        // Save resources folder path :
        this.resources = __dirname + "/../../resources/";

        // Create bot instance and login it :
        Client.instance = this;
        this.login(readFileSync(this.resources + "token.txt", {encoding: "utf-8"}));

        // Load client components :
        this.logger = new Logger();
        this.embed = new Embed();

        // Load events, commands and tasks managers :
        this.eventManager = new EventManager();
        this.logger.success(this.eventManager.eventListenerCount + " events loaded");

        this.commandManager = new CommandManager();
        this.logger.success(this.commandManager.commands.size + " commands loaded");

        this.taskManager = new TaskManager();
        this.logger.success(this.taskManager.taskListenerCount + " tasks loaded");

        this.on("ready", () => {
            // Set activity :
            this.user?.setActivity("royaume.world", {type: "STREAMING", url: "https://www.twitch.tv/royaumeuh"});

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

    public getDevTeam() : User[] | null {
        const owner = this.application?.owner;

        if(owner instanceof User){
            return [owner];
        } else if(owner instanceof Team){
            return owner.members.map(teamMember => teamMember.user);
        } else {
            return null;
        }
    }
}

(new Logger()).info("Sarting in progress (events, commands, tasks connection and client)...");
new Client();