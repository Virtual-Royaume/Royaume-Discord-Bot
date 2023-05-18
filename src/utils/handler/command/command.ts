/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import type { Client } from "discord.js";
import { Collection, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder } from "discord.js";
import { existsSync, readdirSync, statSync } from "fs";
import { isDevEnvironment } from "$core/utils/environment";
import type {
  CommandsCollection, CommandExecute,
  CommandsBuilderCollection, LoadedCommands,
  GuildCommandsCollection, GuildsCommand
} from "./command.type";
import { haveSubcommands, serializeCommandName } from "./command.util";
import { doesFolderExist } from "$core/utils/function";
import { getGuild } from "$core/configs/guild";
import { subCommandDirName, subCommandGroupDirNamePrefix } from "./command.const";
import { sep } from "path";
import { logger } from "$core/utils/logger";
import { userWithId } from "$core/utils/user";

// Some of tests in this function can be removed when this issue https://github.com/microsoft/TypeScript/issues/38511 will be solved
export const load = async(commandsFolder: string): Promise<LoadedCommands> => {
  const commands: CommandsCollection = new Collection();
  const guildCommands: GuildCommandsCollection = new Collection();
  const commandsBuilders: CommandsBuilderCollection = new Collection();
  const folders = readdirSync(commandsFolder);

  // Browse folders in `commandsFolder`
  for (const folder of folders) {
    const path = `${commandsFolder}${sep}${folder}${sep}`;

    if (!statSync(path).isDirectory()) {
      continue;
    }

    // Get command builder
    const builderFileName = `${folder}.builder.ts`;

    if (!existsSync(`${path}${builderFileName}`)) {
      throw new Error(`"${builderFileName}" file can't be found in \`${path}\``);
    }

    const dynamicBuilderImport = await import(`${path}${builderFileName}`);
    const enableInDev = dynamicBuilderImport.enableInDev ?? false;

    if (!enableInDev && isDevEnvironment) {
      continue;
    }

    const builder = dynamicBuilderImport.slashCommand;

    if (!builder) {
      throw new Error(`"${builderFileName}" doesn't have \`salshCommand\` export defined in \`${path}\``);
    }

    if (folder !== builder.name) {
      throw new Error(`Folder name and command name are different in ${path}`);
    }

    commandsBuilders.set(builder.name, builder);

    // Is a command guild
    const guilds: GuildsCommand | undefined = dynamicBuilderImport.guilds;

    if (guilds) {
      for (const guild of guilds) {
        const commands = guildCommands.get(guild) ?? [];
        guildCommands.set(guild, [...commands, builder.name]);
      }
    }

    // Load simple command
    if (!haveSubcommands(builder)) {
      const commandFileName = `${folder}.cmd.ts`;

      if (!existsSync(`${path}${builderFileName}`)) {
        throw new Error(`"${commandFileName}" file can't be found in \`${path}\``);
      }

      const dynamicCommandImport = await import(`${path}${commandFileName}`);
      const execute: CommandExecute = dynamicCommandImport.execute;

      if (!execute) {
        throw new Error(`${commandFileName} doesn't have "execute" function`);
      }

      commands.set(serializeCommandName(builder.name), execute);
      continue;
    }

    // Load SubCommandsGroup & SubCommands
    if (!doesFolderExist(`${path}${subCommandDirName}`)) {
      throw new Error(`${subCommandDirName} doesn't exist`);
    }

    for (const commandOption of builder.options) {

      // SubCommandsGroup loading
      if (commandOption instanceof SlashCommandSubcommandGroupBuilder) {
        const subCommandGroupFolder = `${subCommandDirName}${sep}${subCommandGroupDirNamePrefix}${commandOption.name}${sep}`;

        if (!doesFolderExist(`${path}${subCommandGroupFolder}`)) {
          throw new Error(`"${commandOption.name}" SubCommandGroup folder doesn't exist`);
        }

        // SubCommandGroup-SubCommands loading
        for (const subCommandGroupOption of commandOption.options) {
          const subCommandFileName = `${commandOption.name}-${subCommandGroupOption.name}.cmd.ts`;

          if (!existsSync(`${path}${builderFileName}`)) {
            throw new Error(`"${subCommandFileName}" file can't be found in \`${subCommandGroupFolder}\``);
          }

          const dynamicCommandImport = await import(`${path}${subCommandGroupFolder}${subCommandFileName}`);
          const execute: CommandExecute = dynamicCommandImport.execute;

          if (!execute) {
            throw new Error(`${subCommandFileName} doesn't have "execute" function`);
          }

          commands.set(serializeCommandName(builder.name, subCommandGroupOption.name, commandOption.name), execute);
          continue;
        }

      // SubCommands loading
      } else if (commandOption instanceof SlashCommandSubcommandBuilder) {
        const subCommandFileName = `${commandOption.name}.cmd.ts`;

        if (!existsSync(`${path}${subCommandDirName}${sep}${subCommandFileName}`)) {
          throw new Error(`"${subCommandFileName}" file can't be found in \`${subCommandDirName}\``);
        }

        const dynamicCommandImport = await import(`${path}${subCommandDirName}${sep}${subCommandFileName}`);
        const execute: CommandExecute = dynamicCommandImport.execute;

        if (!execute) {
          throw new Error(`${subCommandFileName} doesn't have "execute" function`);
        }

        commands.set(serializeCommandName(builder.name, commandOption.name), execute);
      }
    }
  }

  return {
    commands,
    guildCommands,
    builders: commandsBuilders
  };
};

export const listener = (client: Client, commands: CommandsCollection): void => {
  client.on("interactionCreate", interaction => {
    if (!interaction.isChatInputCommand()) return;

    const commandExecute = commands.get(serializeCommandName(
      interaction.commandName,
      interaction.options.getSubcommand(false) ?? undefined,
      interaction.options.getSubcommandGroup() ?? undefined
    ));

    if (!commandExecute) return;

    logger.info(`${userWithId(interaction.user)} uses the command "${interaction.commandName}"`);

    void commandExecute(interaction);
  });
};

export const register = async(client: Client, commandsBuilders: CommandsBuilderCollection, guildCommands: GuildCommandsCollection): Promise<void> => {
  let nonGlobalCommandsBuilders: CommandsBuilderCollection = new Collection();
  const guilds = guildCommands.entries();

  // Load guild commands
  for (const [guildId, commands] of guilds) {
    const builders = commandsBuilders.filter((_, commandName) => commands.includes(commandName));
    const guild = await getGuild(client, guildId);

    await guild.commands.set(builders.map(command => command.toJSON()));

    // Merge the current guild `builders` to `nonGlobalCommandsBuilders` Collection
    nonGlobalCommandsBuilders = nonGlobalCommandsBuilders.merge(
      builders,
      origineValue => ({ keep: true, value: origineValue }),
      newValue => ({ keep: true, value: newValue }),
      origineValue => ({ keep: true, value: origineValue }),
    );
  }

  // Load global commands
  await client.application?.commands.set(
    commandsBuilders.difference(nonGlobalCommandsBuilders).map(command => command.toJSON())
  );
};