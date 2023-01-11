import { msg } from "$core/utils/Message";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction,
  EmbedBuilder, PermissionsBitField, SlashCommandBuilder, SlashCommandNumberOption } from "discord.js";
import { verify } from "$resources/config/information.json";
import { getMember, getMonthActivity } from "$core/api/requests/Member";
import { simpleEmbed } from "$core/utils/Embed";
import Command from "$core/commands/Command";
import { gqlRequest } from "$core/utils/request";
import Client from "$core/Client";
import { formatMinutes } from "$core/utils/Function";
import { tiers as configTiers } from "$resources/config/information.json";

let page = 0;

export default class Inactive extends Command {

  public readonly enabledInDev = true;

  public readonly slashCommand = new SlashCommandBuilder()
    .setName(msg("cmd-inactive-builder-name"))
    .setDescription(msg("cmd-inactive-builder-description"))
    .addNumberOption(new SlashCommandNumberOption()
      .setName(msg("cmd-inactive-builder-page-name"))
      .setDescription(msg("cmd-inactive-builder-page-description")));

  public async execute(command: ChatInputCommandInteraction): Promise<void> {
    const verifMembers = (await (await Client.instance.getGuild()).members.fetch()).filter(m => m.roles.cache.has(verify.roles.waiting));

    const response = await gqlRequest(getMonthActivity);

    if (!response.success) {
      command.reply({ embeds: [simpleEmbed(msg("message-execution-error-cmd"), "error")], ephemeral: true });
      return;
    }

    const members = response.data.members.filter(member => {
      const isInVerif = verifMembers.has(member._id);
      const monthMessage = member.activity?.messages.monthCount;
      const monthVoice = member.activity?.monthVoiceMinute;

      return !monthMessage && !monthVoice && !isInVerif;
    });

    if (!members) {
      command.reply({ embeds: [simpleEmbed(msg("message-execution-error-cmd"), "error")], ephemeral: true });
      return;
    }

    if (!members.length) {
      command.reply({ embeds: [simpleEmbed(msg("cmd-inactive-exec-no-inactives"), "error")], ephemeral: true });
      return;
    }

    if (command.options.getNumber("page")) {
      page = (command.options.getNumber("page") ?? 1) - 1;
    }

    const hasKickPermission: boolean = command.memberPermissions?.has(PermissionsBitField.Flags.KickMembers) ?? true;

    if (!command.channel) return;
    const collector = command.channel.createMessageComponentCollector({
      filter: i => i.customId.startsWith("inactive-"),
      time: 300000
    });

    collector.on("collect", async interaction => {
      switch (interaction.customId) {
        case "inactive-previous":
          if (page == 0) {
            interaction.reply({ embeds: [
              simpleEmbed(msg("cmd-inactive-exec-pages-first-first"), "error")
            ], ephemeral: true });
            return;
          }

          page--;
          await interaction.update({ embeds: [
            await this.embedPage(members[page]._id, page, members.length)
          ], components: [
            await this.getButtons(members, hasKickPermission, members.length)
          ] });
          break;
        case "inactive-next":
          if ((page + 1) == members.length) {
            interaction.reply({ embeds: [
              simpleEmbed(msg("cmd-inactive-exec-pages-next-last"), "error")
            ], ephemeral: true });
            return;
          }

          page++;
          await interaction.update({ embeds: [
            await this.embedPage(members[page]._id, page, members.length)
          ], components: [
            await this.getButtons(members, hasKickPermission, members.length)
          ] });
          break;
        case "inactive-kick":
          if (!hasKickPermission) {
            interaction.reply({ embeds: [simpleEmbed(msg("cmd-inactive-exec-kick-permission"), "error")], ephemeral: true });
            return;
          }

          const member = await (await Client.instance.getGuild()).members.fetch(members[page]._id);
          try {
            await member.kick("Inactif");
            interaction.reply({ embeds: [simpleEmbed(msg("cmd-inactive-exec-kicked", [member.user.username]), "normal")], ephemeral: true });
          } catch (e) {
            interaction.reply({
              embeds: [
                simpleEmbed(msg("cmd-inactive-exec-kick-permission-bot"), "error")
              ], ephemeral: true
            });
          }
          break;
        case "inactive-first":
          page = 0;
          await interaction.update({ embeds: [
            await this.embedPage(members[page]._id, page, members.length)
          ], components: [
            await this.getButtons(members, hasKickPermission, members.length)
          ] });
          break;
        case "inactive-last":
          page = members.length - 1;
          await interaction.update({ embeds: [
            await this.embedPage(members[page]._id, page, members.length)
          ], components: [
            await this.getButtons(members, hasKickPermission, members.length)
          ] });
          break;
      }
    });

    collector.on("end", () => {
      command.editReply({ components: [] });
      page = 0;
    });

    await command.reply({ embeds: [
      await this.embedPage(members[page]._id, page, members.length)
    ], components: [
      await this.getButtons(members, hasKickPermission, members.length)
    ], ephemeral: true });
  }

  public async embedPage(memberId: string, inactiveNumber: number, inactivesCount: number) : Promise<EmbedBuilder> {
    const memberInfo = (await gqlRequest(getMember, { id: memberId })).data?.member;
    if (!memberInfo) throw new Error("Member not found");

    const messages = memberInfo.activity?.messages.totalCount ?? "Aucun messages";
    const voice = memberInfo.activity?.voiceMinute;

    const member = await (await Client.instance.getGuild()).members.fetch(memberId);
    const banner = (await member.user.fetch()).bannerURL();
    const tiers: Record<string, string> = configTiers;

    const embed = new EmbedBuilder()
      .setTitle(memberInfo?.username)
      .setDescription(msg("cmd-inactive-embed-content", [
        memberInfo._id, messages, formatMinutes(voice ?? 0), member.user.createdAt.toLocaleDateString(),
        member.joinedAt?.toLocaleDateString() ?? "0 minutes", tiers[memberInfo.activity.tier]]))
      .setColor("#5339DD")
      .setThumbnail(member.user.displayAvatarURL())
      .setFooter({
        text: msg("cmd-inactive-exec-embed-footer", [inactiveNumber + 1, inactivesCount])
      });
    if (banner !== null) embed.setImage(banner + "?size=512");
    return embed;
  }

  public async getButtons(members: any, hasKickPermission: boolean, max: number) : Promise<ActionRowBuilder> {
    return new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("inactive-first")
        .setLabel("⏪")
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(page == 0),
      new ButtonBuilder()
        .setCustomId("inactive-previous")
        .setLabel(page == 0 ? "◀️" : "◀️ (" + members[page - 1].username + ")")
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(page == 0),
      new ButtonBuilder()
        .setCustomId("inactive-kick")
        .setLabel("Expulser ce membre")
        .setStyle(ButtonStyle.Danger)
        .setDisabled(!hasKickPermission),
      new ButtonBuilder()
        .setCustomId("inactive-next")
        .setLabel((page == max || page == (max - 1)) ? "▶️" : "▶️ (" + members[page + 1].username + ")")
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(members.length == (page + 1)),
      new ButtonBuilder()
        .setCustomId("inactive-last")
        .setLabel("⏩")
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(members.length == (page + 1)),
    );
  }

}