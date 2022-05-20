import { 
	SlashCommandBuilder, SlashCommandChannelOption, 
	SlashCommandRoleOption, SlashCommandStringOption 
} from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { ChannelTypes } from "discord.js/typings/enums";
import { request } from "../../api/Request";
import { addChannel, getChannels, removeChannel } from "../../api/requests/MainChannel";
import { addRole, getRoles, removeRole } from "../../api/requests/MainRole";
import { MainChannel, MainRole } from "../../api/Schema";
import { simpleEmbed } from "../../utils/Embed";
import Command from "../Command";

type Action = "add" | "remove" | "list";

interface ActionChoices {
	name: string;
	value: Action;
}

export default class Inactive extends Command {

	private actionChoices: ActionChoices[] = [
		{ name: "Ajout", value: "add" },
		{ name: "Suppression", value: "remove" },
		{ name: "Liste", value: "list" }
	];

    public readonly slashCommand = new SlashCommandBuilder()
		.setName("main")
		.setDescription("Ajouter, supprimer ou voir la liste des salons/rôles principaux")
		.addStringOption(new SlashCommandStringOption()
			.setName("action")
			.setDescription("Ajout ou suppression")
			.addChoices(...this.actionChoices)
			.setRequired(true)
		)
		.addChannelOption(new SlashCommandChannelOption()
			.setName("channel")
			.setDescription("Ajout ou supression de ce salon")
			// @ts-ignore : DJS - DJS/builders typing version problem
			.addChannelTypes(ChannelTypes.GUILD_TEXT)
		)
		.addRoleOption(new SlashCommandRoleOption()
			.setName("role")
			.setDescription("Ajout ou supression de ce rôle")
		)
		.addStringOption(new SlashCommandStringOption()
			.setName("category")
			.setDescription("Catégorie du salon ou rôle")
		);
		
    public readonly defaultPermission: boolean = false;

    public async execute(command: CommandInteraction) : Promise<void> {
		// Get action, channel/role and category :
		const action: Action = <Action>command.options.getString("action", true);

		const channel = command.options.getChannel("channel");
		const role = command.options.getRole("role");

		const category = command.options.getString("category");

		// List action :
		if(action === "list"){
			// Get mains channels and roles :
			const channels = (await request<{ channels: MainChannel[] }>(getChannels)).channels;
			const roles = (await request<{ roles: MainRole[] }>(getRoles)).roles;

			// Sort channels and roles by category :
			const channelsIdsByCategory: { [category: string]: string[] } = {}
			const rolesIdsByCategory: { [category: string]: string[] } = {}

			channels.forEach(channel => {
				if(!channelsIdsByCategory[channel.category]) channelsIdsByCategory[channel.category] = [];

				channelsIdsByCategory[channel.category].push(channel.channelId);
			});

			roles.forEach(role => {
				if(!rolesIdsByCategory[role.category]) rolesIdsByCategory[role.category] = [];

				rolesIdsByCategory[role.category].push(role.roleId);
			});
			
			// Format and send the lists :
			let channelMessage = "";
			let roleMessage = "";

			for(const [category, ids] of Object.entries(channelsIdsByCategory)){
				channelMessage += `**${category} :** ${ids.map(id => "<#" + id + ">").join(", ")}\n\n`;
			}

			for(const [category, ids] of Object.entries(rolesIdsByCategory)){
				roleMessage += `**${category} :** ${ids.map(id => "<@&" + id + ">").join(", ")}\n\n`;
			}

			command.reply({ embeds: [
				simpleEmbed(channelMessage, "normal", "Salons principaux"), 
				simpleEmbed(roleMessage, "normal", "Rôles principaux")
			], ephemeral: true });
		}

		// Add and remove actions :
		interface Result {
			success?: boolean;
			action?: "add" | "remove";
			type?: "role" | "channel";
		}

		if(action === "add" || action === "remove"){
			if(!category && action === "add"){
				command.reply({ embeds: [simpleEmbed("Vous devez choisir une catégorie.", "error")], ephemeral: true });
				return;
			}

			if(!channel && !role){
				command.reply({ embeds: [simpleEmbed("Vous devez mentionner un salon ou un rôle.", "error")], ephemeral: true });
				return;				
			}

			const result: Result = { action: action }

			if(channel){
				result.type = "channel";
				result.success = action === "add" ? 
					(await request<{ addChannel: boolean }>(addChannel, { channelId: channel.id, category: category })).addChannel :
					(await request<{ removeChannel: boolean }>(removeChannel, { channelId: channel.id })).removeChannel;
			} else if(role){
				result.type = "role";
				result.success = action === "add" ?
					(await request<{ addRole: boolean }>(addRole, { roleId: role.id, category: category })).addRole :
					(await request<{ removeRole: boolean }>(removeRole, { roleId: role.id })).removeRole;
			}

			const type = result.type === "role" ? "rôle" : "salon";
			const message = result.success ? 
				`Vous avez bien ${result.action === "add" ? "ajouté" : "supprimé"} le ${type}.` :
				`Erreur lors de ${result.action === "add" ? "l'ajout" : "la suppression"} du ${type}.`

			command.reply({ embeds: [simpleEmbed(message, result.success ? "normal" : "error")], ephemeral: true });
		}
    }
}