import { ApplicationCommandPermissionData, CommandInteraction, GuildMember } from "discord.js";
import Client from "../../client/Client";
import Command from "../Command";
import { youtubeTogether } from "../../../resources/configs/app-integration.json";
import { generalChannel } from "../../../resources/configs/information.json";
import { SlashCommandBuilder } from "@discordjs/builders";
import { simpleEmbed } from "../../utils/Embed";

export default class WatchTogether extends Command {

    public slashCommand: SlashCommandBuilder = new SlashCommandBuilder()
        .setName("wt")
        .setDescription("Permet de générer une invitation pour l'intégration vocal \"Youtube Together\"")

    public permissions: ApplicationCommandPermissionData[] = [];

    public async execute(command: CommandInteraction) : Promise<void> {
        if(!(command.member instanceof GuildMember)){
            command.reply({ embeds: [simpleEmbed("Erreur lors de l'exécution de la commande.", "error")], ephemeral: true });
            return;
        }

        if(!command.member.voice.channelId){
            command.reply({ embeds: [simpleEmbed("Vous devez être dans un salon vocal.", "error")], ephemeral: true });
            return;
        };
    
        const instance: any = Client.instance;
        const generalTextChannel = await Client.instance.getGuild().channels.fetch(generalChannel);

        if(generalTextChannel?.type !== "GUILD_TEXT") return;

        const invite: { code: string } = instance.api.channels(command.member.voice.channelId).invites.post({
            data: {
                temporary: true,
                max_age: 86_400,
                max_uses: 0,
                unique: true,
                target_type: 2,
                target_application_id: youtubeTogether,
            }
        });

        command.reply({ 
            embeds: [simpleEmbed(`Votre activité (**Youtube Together**) a bien été lancée, vous pouvez la rejoindre via cette invitation : https://discord.gg/${invite.code}`)], 
            ephemeral: true 
        });

        generalTextChannel.send({ embeds: [simpleEmbed(
            "<@" + command.user.id + "> a lancé **Youtube Together** !\n\n" +
            "[Rejoindre l'activité](https://discord.gg/" + invite.code + ")",
        )] });
    }
}