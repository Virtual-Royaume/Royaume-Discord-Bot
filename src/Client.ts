import { Client as DiscordClient, Guild, Intents, Team, User } from "discord.js";
import { readFileSync } from "fs";
import EventManager from "./events/EventManager";
import CommandManager from "./commands/CommandManager";
import TaskManager from "./tasks/TaskManager";
import Logger from "./utils/Logger";

export default class Client extends DiscordClient {

    public static instance: Client;

    // Events and commands managers :
    public readonly eventManager: EventManager;
    public readonly commandManager: CommandManager;
    public readonly taskManager: TaskManager;

    // Resources folder :
    public readonly resources: string;

    constructor(){
        super({
            intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_INTEGRATIONS]
        });

        // Save resources folder path :
        this.resources = __dirname + "/../resources/";

        // Create bot instance and login it :
        Client.instance = this;
        this.login(readFileSync(this.resources + "token.txt", {encoding: "utf-8"}));

        // Load events, commands and tasks managers :
        this.eventManager = new EventManager();
        this.commandManager = new CommandManager();
        this.taskManager = new TaskManager();

        this.on("ready", () => {
            this.commandManager.register();

            // Set activity :
            this.user?.setActivity("royaume.world", {type: "STREAMING", url: "https://www.twitch.tv/royaumeuh"});

            // Finish :
            Logger.success("Client has been started");
        });
    }

    public getGuild() : Guild {
        const guild = Client.instance.guilds.cache.first();

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

Logger.info("Sarting in progress...");
new Client();