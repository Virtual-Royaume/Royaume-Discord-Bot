import Client from "$core/Client";
import Command from "$core/commands/Command";
import { msg } from "$core/utils/Message";
import {
  ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, ChatInputCommandInteraction,
  ComponentType, EmbedBuilder, SlashCommandBuilder, SlashCommandNumberOption, MessageActionRowComponentBuilder,
  APIActionRowComponent, APIMessageActionRowComponent, Collection, Snowflake
} from "discord.js";
import { verify } from "$resources/config/information.json";
import { button } from "$resources/config/interaction-ids.json";
import { getMember, getMonthActivity } from "$core/api/requests/Member";
import { simpleEmbed } from "$core/utils/Embed";
import { gqlRequest } from "$core/utils/request";
import { formatMinutes } from "$core/utils/Function";
import { tiers as configTiers } from "$resources/config/information.json";

export default class Inactive extends Command {

  public readonly enabledInDev = true;

  public readonly slashCommand = new SlashCommandBuilder()
    .setName(msg("cmd-inactive-builder-name"))
    .setDescription(msg("cmd-inactive-builder-description"))
    .addNumberOption(new SlashCommandNumberOption()
      .setName(msg("cmd-inactive-builder-page-name"))
      .setDescription(msg("cmd-inactive-builder-page-description")));

  public async execute(command: ChatInputCommandInteraction): Promise<void> {
    // Check if channel and member is defined:
    if (!command.channel || !command.member || !command.memberPermissions) {
      command.reply({ embeds: [simpleEmbed(msg("message-execution-error-cmd"), "error")], ephemeral: true });
      return;
    }

    // Get member:
    const member = command.member;
    const memberId = member.user.id;

    // Parse page command param:
    this.setPage(memberId, (command.options.getNumber("page") || 1) - 1);

    // Get guild instance:
    const guild = await Client.instance.getGuild();

    // Get guild members and non-verif members:
    const guildMembers = await guild.members.fetch();
    const verifMembers = guildMembers.filter(member => member.roles.cache.has(verify.roles.waiting));

    // Find inactive members:
    const response = await gqlRequest(getMonthActivity);

    if (!response.success) {
      command.reply({ embeds: [simpleEmbed(msg("message-execution-error-cmd"), "error")], ephemeral: true });
      return;
    }

    const inactiveMembers = response.data.members.filter(member => {
      const isInVerif = verifMembers.has(member._id);
      const monthMessage = member.activity?.messages.monthCount;
      const monthVoice = member.activity?.monthVoiceMinute;

      return !monthMessage && !monthVoice && !isInVerif;
    });

    if (!inactiveMembers.length) {
      command.reply({ embeds: [simpleEmbed(msg("cmd-inactive-exec-no-inactives"), "error")], ephemeral: true });
      return;
    }

    // Create message button collector and handle it:
    const collector = command.channel.createMessageComponentCollector<ComponentType.Button>({
      filter: interaction => Object.values(button.inactive).includes(interaction.customId),
      time: 1000 * 60 * 30 // 30 minutes
    });

    collector.on("collect", this.handleButtonClick);

    collector.on("end", () => {
      command.editReply({ components: [] });
    });

    // Send default embed:
    await command.reply(
      {
        embeds: [await this.generateEmbed(inactiveMembers[this.getPage(memberId)]._id, this.getPage(memberId), inactiveMembers.length)],
        components: [this.getButtonsComponents(this.getPage(memberId), inactiveMembers.map(member => member.username))],
        ephemeral: true
      }
    );
  }

  private async handleButtonClick(interaction: ButtonInteraction): Promise<void> {
    const id = interaction.customId;
    const actions = button.inactive;

    if (id === actions.inactiveFirst) {
      // page = 0;
      // await interaction.update({ embeds: [
      //   await this.embedPage(members[page]._id, page, members.length)
      // ], components: [
      //   await this.getButtons(members, hasKickPermission, members.length)
      // ] });

      return;
    }

    if (id === actions.inactivePrevious) {
      // page--;
      // await interaction.update({ embeds: [
      //   await this.embedPage(members[page]._id, page, members.length)
      // ], components: [
      //   await this.getButtons(members, hasKickPermission, members.length)
      // ] });

      return;
    }

    if (id === actions.inactiveKick) {
      // TODO: check no perm
      // const hasKickPermission: boolean = command.memberPermissions.has(PermissionsBitField.Flags.KickMembers);
      // interaction.reply({ embeds: [simpleEmbed(msg("cmd-inactive-exec-kick-permission"), "error")], ephemeral: true });

      // const member = await (await Client.instance.getGuild()).members.fetch(members[page]._id);
      // try {
      //   await member.kick("Inactif");
      //   interaction.reply({ embeds: [simpleEmbed(msg("cmd-inactive-exec-kicked", [member.user.username]), "normal")], ephemeral: true });
      // } catch (e) {
      //   interaction.reply({
      //     embeds: [
      //       simpleEmbed(msg("cmd-inactive-exec-kick-permission-bot"), "error")
      //     ], ephemeral: true
      //   });
      // }

      return;
    }

    if (id === actions.inactiveNext) {
      // page++;
      // await interaction.update({ embeds: [
      //   await this.embedPage(members[page]._id, page, members.length)
      // ], components: [
      //   await this.getButtons(members, hasKickPermission, members.length)
      // ] });

      return;
    }

    if (id === actions.inactiveLast) {
      // page = members.length - 1;
      // await interaction.update({ embeds: [
      //   await this.embedPage(members[page]._id, page, members.length)
      // ], components: [
      //   await this.getButtons(members, hasKickPermission, members.length)
      // ] });

      return;
    }
  }

  public async generateEmbed(memberId: Snowflake, inactiveNumber: number, inactivesCount: number) : Promise<EmbedBuilder> {
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

  public getButtonsComponents(currentPage: number, membersUsernames: string[]): APIActionRowComponent<APIMessageActionRowComponent> {
    const maxPage: number = membersUsernames.length;
    const actions = button.inactive;

    return new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
      // First:
      new ButtonBuilder()
        .setCustomId(actions.inactiveFirst)
        .setLabel("⏪")
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(!currentPage),

      // Previous:
      new ButtonBuilder()
        .setCustomId(actions.inactivePrevious)
        .setLabel(!currentPage ? "◀️" : `◀️ (${membersUsernames[currentPage - 1]})`)
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(!currentPage),

      // Kick:
      new ButtonBuilder()
        .setCustomId(actions.inactiveKick)
        .setLabel("Expulser")
        .setStyle(ButtonStyle.Danger),

      // Next:
      new ButtonBuilder()
        .setCustomId(actions.inactiveNext)
        .setLabel(currentPage === maxPage ? "▶️" : `▶️ (${membersUsernames[currentPage + 1]})`)
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(maxPage === currentPage),

      // Last:
      new ButtonBuilder()
        .setCustomId(actions.inactiveLast)
        .setLabel("⏩")
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(maxPage === currentPage)
    ).toJSON();
  }

  private memberPage: Collection<Snowflake, number> = new Collection();

  private setPage(member: Snowflake, page: number): void {
    this.memberPage.set(member, page);
  }

  private getPage(member: Snowflake): number {
    return this.memberPage.get(member) || 0;
  }

}