import { Client as DiscordClient, Guild, Intents, Team, User } from "discord.js";
import EventManager from "./events/EventManager";
import CommandManager from "./commands/CommandManager";
import TaskManager from "./tasks/TaskManager";
import Logger, { logCrown } from "./utils/Logger";
import { botToken } from "../resources/config/secret.json";
import { guildId } from "../resources/config/information.json";
import { version } from "../package.json";

export default class Client extends DiscordClient {

    public static instance: Client;

    // Events and commands managers :
    public readonly eventManager: EventManager;

    public readonly commandManager: CommandManager;

    public readonly taskManager: TaskManager;

    constructor() {
        super({
            intents: [
                Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES,
                Intents.FLAGS.GUILD_INTEGRATIONS, Intents.FLAGS.GUILD_MEMBERS,
                Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_VOICE_STATES,
                Intents.FLAGS.GUILD_BANS
            ],
            partials: ["MESSAGE", "CHANNEL", "REACTION"]
        });

        // Create bot instance and login it :
        Client.instance = this;
        this.login(botToken);

        // Load events, commands and tasks managers :
        this.eventManager = new EventManager();
        this.commandManager = new CommandManager();
        this.taskManager = new TaskManager();
    }

    public async getGuild() : Promise<Guild> {
        return await this.guilds.fetch(guildId);
    }

    public getDevTeam() : User[] | null {
        const owner = this.application?.owner;

        if (owner instanceof User) {
            return [owner];
        } else if (owner instanceof Team) {
            return owner.members.map(teamMember => teamMember.user);
        } else {
            return null;
        }
    }
}

logCrown();
Logger.info(`Sarting Royaume-Discord-Bot V${version}...`);
new Client();