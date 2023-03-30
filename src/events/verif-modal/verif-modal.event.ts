import { interactionId, proposals } from "$core/configs";
import { guilds } from "$core/configs/guild";
import { events } from "$core/configs/message/event";
import { modal } from "./verif-modal.util";
import { simpleEmbed } from "$core/utils/embed";
import { EventExecute, EventName } from "$core/utils/handler/event";
import { msgParams } from "$core/utils/message";
import { BaseGuildTextChannel, GuildMember } from "discord.js";
import { presentationId } from "./verif-modal.const";

export const event: EventName = "interactionCreate";

export const execute: EventExecute<"interactionCreate"> = async(interaction) => {
  if (interaction.guildId !== guilds.pro.guildId) return;

  if (interaction.isButton() && interaction.customId === interactionId.button.verify) {
    if (!(interaction.member instanceof GuildMember)) {
      interaction.reply({
        embeds: [simpleEmbed(events.verifModal.error.guildMember, "error")],
        ephemeral: true
      });

      return;
    }

    if (!interaction.member.roles?.cache.has(guilds.pro.roles.waiting)) {
      interaction.reply({
        embeds: [simpleEmbed(events.verifModal.error.alreadyMember, "error")],
        ephemeral: true
      });
      return;
    }

    interaction.showModal(modal);
    return;
  }

  if (interaction.isModalSubmit() && interaction.customId === interactionId.modal.verify) {
    const presentation = interaction.fields.getTextInputValue(presentationId);
    const generalChannelInstance = await interaction.guild?.channels.fetch(guilds.pro.channels.general);
    const member = interaction.member;

    if (!(generalChannelInstance instanceof BaseGuildTextChannel)) {
      interaction.reply({
        embeds: [simpleEmbed(events.verifModal.error.notTextChannel, "error")],
        ephemeral: true
      });
      return;
    }

    if (!(member instanceof GuildMember)) {
      interaction.reply({
        embeds: [simpleEmbed(events.verifModal.error.guildMember, "error")],
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
          msgParams(events.verifModal.submit.title, [member.displayName])
        ).setFooter({ text: `ID : ${member.id}` })
      ]
    });

    await message.react(proposals.verify.upVote.emoji);
    await message.react(proposals.verify.downVote.emoji);

    interaction.reply({
      embeds: [simpleEmbed(events.verifModal.submit.succes)],
      ephemeral: true
    });
  }
};