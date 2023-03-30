import { getInactiveMembers } from "$core/api/func/member";
import { confirmationModal, getActionRow, getEmbed, getPage, pageNumberByMember } from "./inactive.util";
import { interactionId } from "$core/configs";
import { guilds } from "$core/configs/guild";
import { commands } from "$core/configs/message/command";
import { simpleEmbed } from "$core/utils/embed";
import { CommandExecute } from "$core/utils/handler/command";
import { msgParams } from "$core/utils/message";
import { CacheType, ComponentType, GuildMember, ModalSubmitInteraction, PermissionFlagsBits } from "discord.js";
import { reasonId } from "./inactive.const";

export const execute: CommandExecute = async(command) => {
  if (command.guild?.id !== guilds.pro.guildId) {
    command.reply({
      embeds: [simpleEmbed(commands.inactive.exec.notInGuild, "error")],
      ephemeral: true
    });
    return;
  }

  if (!command.channel) {
    command.reply({
      embeds: [simpleEmbed(commands.inactive.exec.noChannel, "error")],
      ephemeral: true
    });
    return;
  }

  const member = command.member;

  if (!(member instanceof GuildMember)) {
    command.reply({
      embeds: [simpleEmbed(commands.inactive.exec.notGuildMember, "error")],
      ephemeral: true
    });
    return;
  }

  const inactiveMembers = await getInactiveMembers();

  // Query error
  if (!inactiveMembers) {
    command.reply({
      embeds: [simpleEmbed(commands.inactive.exec.activityQueryError, "error")],
      ephemeral: true
    });
    return;
  }

  // No inactive
  if (inactiveMembers.length < 1) {
    command.reply({
      embeds: [simpleEmbed(commands.inactive.exec.noInactiveMembers, "error")],
      ephemeral: true
    });
    return;
  }

  // Get inactives from guild & generate the page data
  const guildMembers = await command.guild.members.fetch();
  const inactiveMembersOnServer = Array.from(
    guildMembers.filter(member => inactiveMembers.find(inactiveMember => inactiveMember._id === member.id)),
    member => member[1]
  );
  const page = await getPage(inactiveMembersOnServer, command.options.getInteger(commands.inactive.options.page.name) ?? 1);

  if (!page) {
    command.reply({
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
    idle: 1000 * 60 * 30
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
        interaction.reply({
          embeds: [simpleEmbed(commands.inactive.exec.kick.noPermission, "error")],
          ephemeral: true
        });
        return;
      }

      const inactiveMember = inactiveMembersOnServer[currentPage - 1];

      // Is inactivveMember kickable by bot
      if (!inactiveMember.kickable) {
        interaction.reply({
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
            time: 1000 * 60 * 5
          });

          // Modal time expires
        } catch (error) {
          interaction.followUp({
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
        inactiveMembersOnServer.splice(currentPage - 1, 1); // Remove kicked user from inactive members
        await modalSubmit.reply({
          embeds: [simpleEmbed(msgParams(commands.inactive.exec.kick.memberKicked, [inactiveMember.id]))],
          ephemeral: true
        });

        // No more inactive members
        if (inactiveMembersOnServer.length < 1) {
          command.editReply({
            embeds: [simpleEmbed(commands.inactive.exec.noInactiveMembers)],
            components: []
          });
          return;
        }

        // Can't kick selected user
      } catch (error) {
        interaction.followUp({
          embeds: [simpleEmbed(commands.inactive.exec.kick.errorWhileKicking, "error")],
          ephemeral: true
        });
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
      command.editReply({
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
      command.editReply(message);
      return;
    }

    interaction.update(message);
  });


  collector.on("end", () => {
    command.editReply({ components: [] });
    pageNumberByMember.delete(member.id);
  });
};