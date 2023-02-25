import { CommandEnabledInDev, SlashCommandDefition } from "$core/utils/command";
import { SlashCommandBuilder } from "discord.js";

export const enableInDev: CommandEnabledInDev = true;

export const slashCommand: SlashCommandDefition = new SlashCommandBuilder()
  .setName("permissions")
  .setDescription("Gérer les permissions")

  // Role SubCommandGroup
  .addSubcommandGroup(subCommandGroup => subCommandGroup
    .setName("role")
    .setDescription("Groupe de commande pour la gestion des permissions des rôles")
    .addSubcommand(subCommand => subCommand
      .setName("get")
      .setDescription("Récupérer les permissions d'un rôle"))
    .addSubcommand(subCommand => subCommand
      .setName("set")
      .setDescription("Definir les permissions d'un rôle")))

  // User SubCommandGroup
  .addSubcommandGroup(subCommandGroup => subCommandGroup
    .setName("user")
    .setDescription("Groupe de commande pour la gestion des permissions des utilisateurs")
    .addSubcommand(subCommand => subCommand
      .setName("get")
      .setDescription("Récupérer les permissions d'un utilisateur"))
    .addSubcommand(subCommand => subCommand
      .setName("set")
      .setDescription("Definir les permissions d'un utilisateur")))

  // SubCommands
  .addSubcommand(subCommand => subCommand
    .setName("idk")
    .setDescription("je ne sais pas"));