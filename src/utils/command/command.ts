import { Client, Collection, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder } from "discord.js";
import { existsSync, readdirSync, statSync } from "fs";
import { isDevEnvironment } from "$core/utils/Environment";
import { CommandsCollection, CommandEnabledInDev, CommandExecute,
  SlashCommandDefition, CommandsBuilderCollection, LoadedCommands } from "./command.type";
import { haveSubcommands, isFolderExist, serializeCommandName } from "./command.util";

const subCommandDirName = "[sub-commands]";
const subCommandGroupDirNamePrefix = "group-";

export const load = async(commandsFolder: string): Promise<LoadedCommands> => {
  const commands: CommandsCollection = new Collection();
  const commandsBuilders: CommandsBuilderCollection = new Collection();
  const folders = readdirSync(commandsFolder);

  for (const folder of folders) {
    const path = `${commandsFolder}\\${folder}\\`;

    if (!statSync(path).isDirectory()) continue;

    const builderFileName = `${folder}.builder.ts`;

    if (!existsSync(`${path}${builderFileName}`)) throw new Error(`"${builderFileName}" file can't be found in \`${path}\``);

    const dynamicBuilderImport = await import(`${path}${builderFileName}`);
    const enableInDev: CommandEnabledInDev = dynamicBuilderImport.enableInDev;

    if (!enableInDev && isDevEnvironment) continue;

    const builder: SlashCommandDefition = dynamicBuilderImport.slashCommand;

    if (folder !== builder.name) throw new Error("Folder name and command name are different");

    commandsBuilders.set(builder.name, builder);

    // Load simple command
    if (!haveSubcommands(builder)) {
      const commandFileName = `${folder}.cmd.ts`;

      if (!existsSync(`${path}${builderFileName}`)) throw new Error(`"${commandFileName}" file can't be found in \`${path}\``);

      const dynamicCommandImport = await import(`${path}${commandFileName}`);
      const execute: CommandExecute = dynamicCommandImport.execute;

      commands.set(serializeCommandName(builder.name), execute);
      continue;
    }

    // Load SubCommandsGroup & SubCommands
    if (!isFolderExist(`${path}${subCommandDirName}`)) throw new Error(`${subCommandDirName} doesn't exist`);

    for (const commandOption of builder.options) {
      // SubCommandsGroup loading
      if (commandOption instanceof SlashCommandSubcommandGroupBuilder) {
        const subCommandGroupFolder = `${subCommandDirName}\\${subCommandGroupDirNamePrefix}${commandOption.name}\\`;

        if (!isFolderExist(`${path}${subCommandGroupFolder}`)) throw new Error(`"${commandOption.name}" SubCommandGroup folder doesn't exist`);

        // SubCommandGroup-SubCommands loading
        for (const subCommandGroupOption of commandOption.options) {
          const subCommandFileName = `${commandOption.name}-${subCommandGroupOption.name}.cmd.ts`;

          if (!existsSync(`${path}${builderFileName}`)) {
            throw new Error(`"${subCommandFileName}" file can't be found in \`${subCommandGroupFolder}\``);
          }

          const dynamicCommandImport = await import(`${path}${subCommandGroupFolder}${subCommandFileName}`);
          const execute: CommandExecute = dynamicCommandImport.execute;

          commands.set(serializeCommandName(builder.name, subCommandGroupOption.name, commandOption.name), execute);
          continue;
        }

      // SubCommands loading
      } else if (commandOption instanceof SlashCommandSubcommandBuilder) {
        const subCommandFileName = `${commandOption.name}.cmd.ts`;

        if (!existsSync(`${path}${subCommandDirName}\\${subCommandFileName}`)) {
          throw new Error(`"${subCommandFileName}" file can't be found in \`${subCommandDirName}\``);
        }

        const dynamicCommandImport = await import(`${path}${subCommandDirName}\\${subCommandFileName}`);
        const execute: CommandExecute = dynamicCommandImport.execute;

        commands.set(serializeCommandName(builder.name, commandOption.name), execute);
      }
    }
  }

  return {
    commands,
    builders: commandsBuilders
  };
};

export const listener = (client: Client, commands: CommandsCollection): void => {
  client.on("interactionCreate", async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const commandExecute = commands.get(serializeCommandName(
      interaction.commandName,
      interaction.options.getSubcommand(false) ?? undefined,
      interaction.options.getSubcommandGroup() ?? undefined
    ));

    if (commandExecute) commandExecute(interaction);
  });
};

export const register = async(client: Client, commandsBuilders: CommandsBuilderCollection): Promise<void> => {
  await client.application?.commands.set(
    commandsBuilders.map(command => {
      return command.toJSON();
    })
  );
};