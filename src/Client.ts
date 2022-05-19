import { Client as DiscordClient, Guild, Intents, Team, User } from "discord.js";
import EventManager from "./events/EventManager";
import CommandManager from "./commands/CommandManager";
import TaskManager from "./tasks/TaskManager";
import Logger from "./utils/Logger";
import { botToken } from "../resources/config/secret.json";

export default class Client extends DiscordClient {

    public static instance: Client;

    // Events and commands managers :
    public readonly eventManager: EventManager;
    public readonly commandManager: CommandManager;
    public readonly taskManager: TaskManager;

    constructor(){
        super({
            intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_INTEGRATIONS]
        });

        // Create bot instance and login it :
        Client.instance = this;
        this.login(botToken);

        // Load events, commands and tasks managers :
        this.eventManager = new EventManager();
        this.commandManager = new CommandManager();
        this.taskManager = new TaskManager();
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