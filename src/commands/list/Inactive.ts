import Client from "$core/Client";
import Command from "$core/commands/Command";
import { msg } from "$core/utils/Message";
import {
  ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, ChatInputCommandInteraction,
  ComponentType, EmbedBuilder, SlashCommandBuilder, SlashCommandNumberOption, MessageActionRowComponentBuilder,
  APIActionRowComponent, APIMessageActionRowComponent, Collection, Snowflake, GuildMember, PermissionsBitField
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

    // Find inactive members:
    const inactiveMembers = await this.getInactiveMembers();

    if (!inactiveMembers) {
      command.reply({ embeds: [simpleEmbed(msg("message-execution-error-cmd"), "error")], ephemeral: true });
      return;
    }

    if (!inactiveMembers.length) {
      command.reply({ embeds: [simpleEmbed(msg("cmd-inactive-exec-no-inactives"), "error")], ephemeral: true });
      return;
    }

    // Create message button collector and handle it:
    const collector = command.channel.createMessageComponentCollector<ComponentType.Button>({
      filter: interaction => Object.values(button.inactive).includes(interaction.customId) && interaction.member.id === memberId,
      time: 1000 * 60 * 30 // 30 minutes
    });

    collector.on("collect", interaction => this.handleButtonClick(interaction));

    collector.on("end", () => {
      command.editReply({ components: [] });
    });

    // Send default embed:
    await command.reply(
      {
        embeds: [await this.generateEmbed(memberId, inactiveMembers[this.getPage(memberId)]._id)],
        components: [await this.getButtonsComponents(memberId)],
        ephemeral: true
      }
    );
  }

  private async getInactiveMembers() {
    // Get guild instance:
    const guild = await Client.instance.getGuild();

    // Get guild members and non-verif members:
    const guildMembers = await guild.members.fetch();
    const verifMembers = guildMembers.filter(member => member.roles.cache.has(verify.roles.waiting));

    // Get inactives members:
    const response = await gqlRequest(getMonthActivity);

    if (!response.success) return null;

    const inactiveMembers = response.data.members.filter(member => {
      const isInVerif = verifMembers.has(member._id);
      const monthMessage = member.activity?.messages.monthCount;
      const monthVoice = member.activity?.monthVoiceMinute;

      return !monthMessage && !monthVoice && !isInVerif;
    });

    return inactiveMembers;
  }

  private async handleButtonClick(interaction: ButtonInteraction): Promise<void> {
    // Get interaction member:
    const member = interaction.member;

    if (!(member instanceof GuildMember)) return;

    // Get inactives members:
    const inactiveMembers = await this.getInactiveMembers();

    if (!inactiveMembers) return;

    // Get actions and interaction ID:
    const id = interaction.customId;
    const actions = button.inactive;

    // Get current page:
    const currentPage = this.getPage(member.id);

    // Handle actions:
    if (id === actions.inactiveFirst) this.setPage(member.id, 0);
    if (id === actions.inactivePrevious) this.setPage(member.id, currentPage - 1);

    if (id === actions.inactiveKick) {
      // Check permission:
      const hasPermission = member.permissions.has(PermissionsBitField.Flags.KickMembers);

      if (!hasPermission) {
        interaction.reply({ embeds: [simpleEmbed(msg("cmd-inactive-exec-kick-permission"), "error")], ephemeral: true });
        return;
      }

      // Get inactive member:
      const guild = await Client.instance.getGuild();
      const inactiveMember = await guild.members.fetch(inactiveMembers[currentPage]._id);

      // Try to kick inactive member:
      try {
        await inactiveMember.kick();
        interaction.reply({ embeds: [simpleEmbed(msg("cmd-inactive-exec-kicked", [member.user.username]), "normal")], ephemeral: true });
      } catch (_) {
        interaction.reply({
          embeds: [simpleEmbed(msg("cmd-inactive-exec-kick-permission-bot"), "error")],
          ephemeral: true
        });
      }
    }

    if (id === actions.inactiveNext) this.setPage(member.id, currentPage + 1);
    if (id === actions.inactiveLast) this.setPage(member.id, inactiveMembers.length - 1);

    // Update embed and buttons:
    await interaction.update({
      embeds: [await this.generateEmbed(member.id, inactiveMembers[this.getPage(member.id)]._id)],
      components: [await this.getButtonsComponents(member.id)]
    });
  }

  public async generateEmbed(memberId: Snowflake, inactiveId: Snowflake): Promise<EmbedBuilder> {
    // Get inactive members:
    const inactiveMembers = await this.getInactiveMembers();

    if (!inactiveMembers) return simpleEmbed(msg("message-execution-error-cmd"), "error");

    // Get current page:
    const page = this.getPage(memberId);

    // Get member info:
    const response = await gqlRequest(getMember, { id: inactiveId });

    if (!response.success || !response.data.member) return simpleEmbed(msg("message-execution-error-cmd"), "error");

    const memberInfo = response.data.member;

    // Get member instance:
    const guild = await Client.instance.getGuild();
    const memberInstance = await guild.members.fetch(inactiveId);

    // Format data:
    const messageCount = memberInfo.activity.messages.totalCount;
    const voiceMinute = memberInfo.activity.voiceMinute;

    const avatar = memberInstance.user.displayAvatarURL();
    const banner = (await memberInstance.user.fetch()).bannerURL();

    // Get tiers:
    const tiers: Record<string, string> = configTiers;

    // Build embed:
    const embed = new EmbedBuilder()
      .setTitle(memberInfo.username)
      .setDescription(msg(
        "cmd-inactive-embed-content",
        [
          inactiveId, messageCount, formatMinutes(voiceMinute), memberInstance.user.createdAt.toLocaleDateString(),
          memberInstance.joinedAt?.toLocaleDateString() ?? "0 minutes", tiers[memberInfo.activity.tier]
        ]
      ))
      .setColor("#5339DD")
      .setThumbnail(avatar)
      .setFooter({
        text: msg("cmd-inactive-exec-embed-footer", [page + 1, inactiveMembers.length])
      });

    if (banner !== null) embed.setImage(`${banner}?size=512`);

    return embed;
  }

  public async getButtonsComponents(memberId: Snowflake): Promise<APIActionRowComponent<APIMessageActionRowComponent>> {
    const inactiveMembers = await this.getInactiveMembers();

    if (!inactiveMembers) return new ActionRowBuilder<MessageActionRowComponentBuilder>().toJSON();

    const currentPage = this.getPage(memberId);
    const maxPage: number = inactiveMembers.length - 1;
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
        .setLabel(!currentPage ? "◀️" : `◀️ (${inactiveMembers[currentPage].username})`)
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
        .setLabel(currentPage === maxPage ? "▶️" : `▶️ (${inactiveMembers[currentPage].username})`)
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