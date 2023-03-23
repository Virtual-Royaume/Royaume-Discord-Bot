import { Client as DiscordClient, GatewayIntentBits, Partials, Team, User } from "discord.js";
import { logger } from "$core/utils/logger";
import { version, displayName } from "../package.json";
import { getStringEnv } from "./utils/env-variable";

import { listener, load as loadCommands, register } from "$core/utils/handler/command";
import { load as loadEvents } from "$core/utils/handler/event";
import { load as loadTasks } from "$core/utils/handler/task";

export const rootDirectory = __dirname;

export const client = new DiscordClient({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildMessages
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

export const getDevTeam = (client: DiscordClient): User[] | null => {
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
  logger.info(`Sarting ${displayName} v${version}...`);

  const eventsLoaded = await loadEvents(client, `${rootDirectory}\\events`);

  logger.info(`${eventsLoaded} events loaded`);

  const tasksLoaded = await loadTasks(`${rootDirectory}\\tasks`);

  logger.info(`${tasksLoaded} tasks loaded`);

  const loadedCommands = await loadCommands(`${rootDirectory}\\commands`);

  logger.info(`${loadedCommands.builders.size} commands loaded`);

  await client.login(getStringEnv("BOT_TOKEN"));
  listener(client, loadedCommands.commands);
  await register(client, loadedCommands.builders, loadedCommands.guildCommands);

  logger.info("Successfully registered application (/) commands");
  logger.success("Client has been started");
})();