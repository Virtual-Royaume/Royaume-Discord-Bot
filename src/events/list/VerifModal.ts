import Event, { EventName } from "$core/events/Event";
import {
  BaseGuildTextChannel, ButtonInteraction,
  GuildMember, Interaction, ActionRowBuilder,
  ModalBuilder, ModalSubmitInteraction, TextInputBuilder, TextInputStyle
} from "discord.js";
import { button, modal as modalIds } from "$resources/config/interaction-ids.json";
import { generalChannel } from "$resources/config/information.json";
import Client from "$core/client";
import { simpleEmbed } from "$core/utils/Embed";
import { verify } from "$resources/config/information.json";
import { msg } from "$core/utils/Message";

export default class VerifModal extends Event {

  public readonly enabledInDev = false;

  public name: EventName = "interactionCreate";

  public async execute(interaction: Interaction): Promise<void> {
    if (interaction.isButton() && interaction.customId === button.verify) this.openModal(interaction);
    if (interaction.isModalSubmit() && interaction.customId === modalIds.verify) this.submitModal(interaction);
  }

  private async openModal(interaction: ButtonInteraction): Promise<void> {
    // Checks :
    if (!(interaction.member instanceof GuildMember)) {
      interaction.reply({
        embeds: [simpleEmbed(msg("event-verifmodal-exec-embed-open-error"), "error")],
        ephemeral: true
      });

      return;
    }

    if (!interaction.member.roles?.cache.has(verify.roles.waiting)) {
      interaction.reply({
        embeds: [simpleEmbed(msg("event-verifmodal-exec-embed-already-member-error"), "error")],
        ephemeral: true
      });
      return;
    }

    const modal = new ModalBuilder()
      .setCustomId(modalIds.verify)
      .setTitle(msg("event-verifmodal-exec-modal-title"))
      .addComponents(new ActionRowBuilder<TextInputBuilder>().addComponents(new TextInputBuilder()
        .setCustomId("presentation")
        .setLabel(msg("event-verifmodal-exec-modal-label"))
        .setStyle(TextInputStyle.Paragraph)
        .setMinLength(50)));

    await interaction.showModal(modal);
  }

  private async submitModal(interaction: ModalSubmitInteraction): Promise<void> {
    // Get presentation :
    const presentation = interaction.fields.getTextInputValue("presentation");

    // Get general channel and member instances :
    const generalChannelInstance = await (await Client.instance.getGuild()).channels.fetch(generalChannel);
    const member = interaction.member;

    if (
      !(generalChannelInstance instanceof BaseGuildTextChannel)
            || !(member instanceof GuildMember)
    ) {
      interaction.reply({
        embeds: [simpleEmbed(msg("event-verifmodal-exec-embed-modal-send-error"), "error")],
        ephemeral: true
      });

      return;
    }

    // Send the presentation in general channel with votes :
    const message = await generalChannelInstance.send({
      embeds: [
        simpleEmbed(
          presentation,
          "normal",
          msg("event-verifmodal-exec-embed-title", [member.displayName])
        ).setFooter({ text: `ID : ${member.id}` })
      ]
    });

    await message.react(verify.emoji.upVote);
    await message.react(verify.emoji.downVote);

    // Send confirmation reply :
    interaction.reply({
      embeds: [simpleEmbed(msg("event-verifmodal-exec-modal-sent-successfully-mp"))],
      ephemeral: true
    });
  }

}