import { Client as DiscordClient, GatewayIntentBits, Guild, Partials, Team, User } from "discord.js";
import EventManager from "$core/events/EventManager";
import CommandManager from "$core/commands/CommandManager";
import TaskManager from "$core/tasks/TaskManager";
import Logger, { logCrown } from "$core/utils/Logger";
import { guildId } from "$resources/config/information.json";
import { version } from "../package.json";
import { getStringEnv } from "./utils/EnvVariable";

export default class Client extends DiscordClient {

  public static instance: Client;

  // Events and commands managers :
  public readonly eventManager: EventManager;

  public readonly commandManager: CommandManager;

  public readonly taskManager: TaskManager;

  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildIntegrations, GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildBans
      ],
      partials: [Partials.Message, Partials.Channel, Partials.Reaction]
    });

    // Create bot instance and login it :
    Client.instance = this;
    this.login(getStringEnv("BOT_TOKEN"));

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

  public isProdEnvironment() : boolean {
    return process.argv.includes("prod"); // TODO : refactor this
  }

}

logCrown();
Logger.info(`Sarting Royaume-Discord-Bot V${version}...`);
new Client();