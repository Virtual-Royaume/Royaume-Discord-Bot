import type { CommandExecute } from "#/utils/handler/command";
import type { CacheType, ComponentType, ModalSubmitInteraction } from "discord.js";
import { confirmationModal, getActionRow, getEmbed, getInactiveMembers, getPage, pageNumberByMember } from "./inactive.util";
import { interactionId } from "#/configs/global";
import { guilds } from "#/configs/guild";
import { commands } from "#/configs/message/command";
import { simpleEmbed } from "#/utils/discord/embed";
import { msgParams } from "#/utils/message";
import { GuildMember, PermissionFlagsBits } from "discord.js";
import { reasonId } from "./inactive.const";
import { logger } from "#/utils/logger";
import { userWithId } from "#/utils/discord/user";
import { getGuildMembers } from "#/utils/discord/guild";

export const execute: CommandExecute = async(command) => {
  if (command.guild?.id !== guilds.pro.guildId) {
    void command.reply({
      embeds: [simpleEmbed(commands.inactive.exec.notInGuild, "error")],
      ephemeral: true
    });
    return;
  }

  if (!command.channel) {
    void command.reply({
      embeds: [simpleEmbed(commands.inactive.exec.noChannel, "error")],
      ephemeral: true
    });
    return;
  }

  const member = command.member;

  if (!(member instanceof GuildMember)) {
    void command.reply({
      embeds: [simpleEmbed(commands.inactive.exec.notGuildMember, "error")],
      ephemeral: true
    });
    return;
  }

  const inactiveMembers = await getInactiveMembers();

  // Query error
  if (!inactiveMembers.ok) {
    void command.reply({
      embeds: [simpleEmbed(commands.inactive.exec.activityQueryError, "error")],
      ephemeral: true
    });
    return;
  }

  // No inactive
  if (inactiveMembers.value.length < 1) {
    void command.reply({
      embeds: [simpleEmbed(commands.inactive.exec.noInactiveMembers, "error")],
      ephemeral: true
    });
    return;
  }

  // Get inactives from guild & generate the page data
  const guildMembers = await getGuildMembers(command.guild);

  if (!guildMembers) {
    void command.reply({
      embeds: [simpleEmbed(commands.inactive.exec.unableFetchGuildMembers, "error")],
      ephemeral: true
    });
    return;
  }

  const inactiveMembersOnServer = Array.from(
    guildMembers.filter(member => inactiveMembers.value.find(inactiveMember => inactiveMember._id === member.id)),
    member => member[1]
  );
  const page = await getPage(inactiveMembersOnServer, command.options.getInteger(commands.inactive.options.page.name) ?? 1);

  if (!page) {
    void command.reply({
      embeds: [simpleEmbed(commands.inactive.exec.memberQueryError, "error")],
      ephemeral: true
    });
    return;
  }

  // Send the inactive member page
  pageNumberByMember.set(member.id, page.page);

  const replyMessage = await command.reply({
    embeds: [getEmbed(page)],
    components: [getActionRow(page, member.permissions.has(PermissionFlagsBits.KickMembers))],
    ephemeral: true
  });

  // Create collector form buttons
  const collector = replyMessage.createMessageComponentCollector<ComponentType.Button>({
    time: 1000 * 60 * 12
  });

  collector.on("collect", async interaction => {
    const ids = interactionId.button.inactive;
    const id = interaction.customId;
    const currentPage = pageNumberByMember.get(member.id) ?? 1;
    let newPageNum = currentPage;

    // Kick interaction
    if (id === ids.inactiveKick) {
      // Member has permission to kick
      if (!member.permissions.has(PermissionFlagsBits.KickMembers)) {
        void interaction.reply({
          embeds: [simpleEmbed(commands.inactive.exec.kick.noPermission, "error")],
          ephemeral: true
        });
        return;
      }

      const inactiveMember = inactiveMembersOnServer[currentPage - 1];

      // Is inactivveMember kickable by bot
      if (!inactiveMember.kickable) {
        void interaction.reply({
          embeds: [simpleEmbed(commands.inactive.exec.kick.botCantKick, "error")],
          ephemeral: true
        });
        return;
      }

      try {
        // Confirmation modal
        await interaction.showModal(confirmationModal(inactiveMember.user.username));
        let modalSubmit: ModalSubmitInteraction<CacheType>;

        // Wait the modal response
        try {
          modalSubmit = await interaction.awaitModalSubmit({
            filter: (interaction) => interaction.customId === interactionId.modal.inactive && interaction.user.id === member.id,
            time: 1000 * 60 * 2
          });

          // Modal time expires
        } catch (error) {
          void interaction.followUp({
            embeds: [simpleEmbed(commands.inactive.exec.kick.kickTimeExpired, "error")],
            ephemeral: true
          });
          return;
        }

        // Kick the user
        const modalReason = modalSubmit.fields.getTextInputValue(reasonId);
        const reason = modalReason.length < 1 ? commands.inactive.exec.kick.kickDefaultReason : modalReason;

        await inactiveMember.send({
          embeds: [simpleEmbed(msgParams(commands.inactive.exec.kick.kickMessage, [reason]), "error")]
        });
        await inactiveMember.kick(msgParams(commands.inactive.exec.kick.kickReason, [member.user.username, reason]));

        logger.info(`User ${userWithId(inactiveMember.user)} was kicked by ${userWithId(member.user)} for ${reason}`);
        inactiveMembersOnServer.splice(currentPage - 1, 1); // Remove kicked user from inactive members
        await modalSubmit.reply({
          embeds: [simpleEmbed(msgParams(commands.inactive.exec.kick.memberKicked, [inactiveMember.id]))],
          ephemeral: true
        });

        // No more inactive members
        if (inactiveMembersOnServer.length < 1) {
          void command.editReply({
            embeds: [simpleEmbed(commands.inactive.exec.noInactiveMembers)],
            components: []
          });
          return;
        }

        // Can't kick selected user
      } catch (error) {
        void interaction.followUp({
          embeds: [simpleEmbed(commands.inactive.exec.kick.errorWhileKicking, "error")],
          ephemeral: true
        });

        logger.error(`Error while kicking user ${inactiveMember.user.username} by ${member.user.username}: ${String(error)}`);
        return;
      }
    }

    // Set the new page number by the button pressed
    if (id === ids.inactiveFirst) newPageNum = 1;
    if (id === ids.inactivePrevious) newPageNum = currentPage - 1;
    if (id === ids.inactiveNext) newPageNum = currentPage + 1;
    if (id === ids.inactiveLast) newPageNum = inactiveMembersOnServer.length;

    const newPage = await getPage(inactiveMembersOnServer, newPageNum);

    if (!newPage) {
      void command.editReply({
        embeds: [simpleEmbed(commands.inactive.exec.memberQueryError, "error")],
        components: []
      });
      return;
    }

    pageNumberByMember.set(member.id, newPage.page);

    const message = {
      embeds: [getEmbed(newPage)],
      components: [getActionRow(newPage, member.permissions.has(PermissionFlagsBits.KickMembers))]
    };

    // If interaction open kick reason modal
    if (interaction.replied) {
      void command.editReply(message);
      return;
    }

    void interaction.update(message);
  });


  collector.on("end", () => {
    void command.editReply({ components: [] });
    pageNumberByMember.delete(member.id);
  });
};