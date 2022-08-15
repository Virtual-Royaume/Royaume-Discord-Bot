import { CommandInteraction, GuildMember } from "discord.js";
import Client from "../../Client";
import Command from "../Command";
import { youtubeTogether } from "../../../resources/config/app-integration.json";
import { generalChannel } from "../../../resources/config/information.json";
import { SlashCommandBuilder } from "@discordjs/builders";
import { simpleEmbed } from "../../utils/Embed";
import { message } from "../../utils/Message";

export default class WatchTogether extends Command {

    public readonly slashCommand = new SlashCommandBuilder()
        .setName(message("command-together-name"))
        .setDescription(message("command-together-description"));

    public async execute(command: CommandInteraction) : Promise<void> {
        if (!(command.member instanceof GuildMember)) {
            command.reply({ embeds: [simpleEmbed(message("message-execution-error"), "error")], ephemeral: true });
            return;
        }

        if (!command.member.voice.channelId) {
            command.reply({ embeds: [simpleEmbed(message("command-together-voice-needed"), "error")], ephemeral: true });
            return;
        }

        const instance: any = Client.instance;
        const generalTextChannel = await (await Client.instance.getGuild()).channels.fetch(generalChannel);

        if (generalTextChannel?.type !== "GUILD_TEXT") return;

        const invite: { code: string } = await instance.api.channels(command.member.voice.channelId).invites.post({
            data: {
                temporary: true,
                max_age: 86_400,
                max_uses: 0,
                unique: true,
                target_type: 2,
                target_application_id: youtubeTogether
            }
        });

        command.reply({
            embeds: [simpleEmbed(message("command-together",[invite.code]))],
            ephemeral: true
        });

        generalTextChannel.send({
            embeds: [simpleEmbed(message("command-together-general",[command.user.id, invite.code]))]
        });
    }
}