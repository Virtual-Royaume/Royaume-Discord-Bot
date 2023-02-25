import { Client as DiscordClient, GatewayIntentBits, Guild, Partials, Team, User } from "discord.js";
import Logger, { logCrown } from "$core/utils/Logger";
import { version, displayName } from "../package.json";
import { getStringEnv } from "./utils/EnvVariable";
import { guildId } from "$resources/config/information.json";
import { listener, load, register } from "$core/utils/command";

export const client = new DiscordClient({
  intents: [
    GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildIntegrations, GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildModeration, GatewayIntentBits.GuildMessages
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

export const getGuild = async(): Promise<Guild> => {
  return await client.guilds.fetch(guildId);
};

export const getDevTeam = (): User[] | null => {
  const owner = client.application?.owner;

  if (owner instanceof User) {
    return [owner];
  } else if (owner instanceof Team) {
    return owner.members.map(teamMember => teamMember.user);
  } else {
    return null;
  }
};

(async() => {
  logCrown();
  Logger.info(`Sarting ${displayName} v${version}...`);
  await client.login(getStringEnv("BOT_TOKEN"));

  const loadedCommands = await load(`${__dirname}\\commands`);

  Logger.info(`${loadedCommands.builders.size} commands loaded`);
  listener(client, loadedCommands.commands);
  await register(client, loadedCommands.builders);
  Logger.info("Successfully registered application (/) commands");
})();