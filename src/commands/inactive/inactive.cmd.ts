import { getInactiveMembers } from "$core/api/func/member";
import { confirmationModal, formatPage, getPage, pageNumberByMember, reasonId } from "$core/commands/inactive/inactive.util";
import { interactionId } from "$core/configs";
import { guilds } from "$core/configs/guild";
import { commands } from "$core/configs/message/command";
import { simpleEmbed } from "$core/utils/embed";
import { CommandExecute } from "$core/utils/handler/command";
import { msgParams } from "$core/utils/message";
import { ComponentType, GuildMember, PermissionFlagsBits } from "discord.js";

export const execute: CommandExecute = async(command) => {
  if (command.guild?.id !== guilds.pro.guildId) {
    // Msg
    return;
  }

  if (!command.channel) {
    // Msg
    return;
  }

  const member = command.member;
  if (!(member instanceof GuildMember)) {
    // Msg
    return;
  }

  const inactiveMembers = await getInactiveMembers();

  if (!inactiveMembers) {
    // MSG
    return;
  }

  const guildMembers = await command.guild.members.fetch();
  const inactiveMembersOnServer = Array.from(
    guildMembers.filter(member => inactiveMembers.find(inactiveMember => inactiveMember._id === member.id)),
    member => member[1]
  );
  const page = await getPage(inactiveMembersOnServer, command.options.getInteger(commands.inactive.options.page.name) ?? 1);

  if (!page) {
    // Msg
    return;
  }

  pageNumberByMember.set(member.id, page.page);

  const formattedPage = formatPage(page, member.permissions.has(PermissionFlagsBits.KickMembers));
  const replyMessage = await command.reply({
    embeds: [formattedPage.embed],
    components: [formattedPage.components],
    ephemeral: true
  });
  const collector = replyMessage.createMessageComponentCollector<ComponentType.Button>({
    idle: 1000 * 60 * 30
  });

  collector.on("collect", async interaction => {
    const ids = interactionId.button.inactive;
    const id = interaction.customId;

    let newPageNum = 1;
    const currentPage = pageNumberByMember.get(member.id) ?? 1;

    if (id === ids.inactiveKick) {
      if (!member.permissions.has(PermissionFlagsBits.KickMembers)) {
        // msg
        return;
      }

      try {
        await interaction.showModal(confirmationModal);

        const modalSubmit = await interaction.awaitModalSubmit({
          filter: (interaction) => interaction.customId === interactionId.modal.inactive && interaction.user.id === member.id,
          time: 1000 * 60 * 5
        });

        const modalReason = modalSubmit.fields.getTextInputValue(reasonId);
        const reason = modalReason.length < 1 ? commands.inactive.exec.kick.kickDefaultReason : modalReason;
        const inactiveMember = inactiveMembersOnServer[currentPage - 1];

        await inactiveMember.send({
          embeds: [simpleEmbed(msgParams(commands.inactive.exec.kick.kickMessage, [reason]), "error")]
        });
        await inactiveMember.kick(msgParams(commands.inactive.exec.kick.kickReason, [member.user.username, reason]));

        inactiveMembersOnServer.splice(currentPage - 1, 1);
        newPageNum = currentPage;

        await modalSubmit.reply({
          embeds: [simpleEmbed("C'est ban", "error")],
          ephemeral: true
        });
      } catch (_) {
        interaction.reply({
          embeds: [simpleEmbed("erreur", "error")],
          ephemeral: true
        });
        return;
      }
    }

    if (id === ids.inactiveFirst) newPageNum = 1;
    if (id === ids.inactiveLast) newPageNum = inactiveMembersOnServer.length;
    if (id === ids.inactiveNext) newPageNum = currentPage + 1;
    if (id === ids.inactivePrevious) newPageNum = currentPage - 1;

    const newPage = await getPage(inactiveMembersOnServer, newPageNum);

    if (!newPage) {
    // Msg
      return;
    }

    pageNumberByMember.set(member.id, newPage.page);

    const formattedPage = formatPage(newPage, member.permissions.has(PermissionFlagsBits.KickMembers));

    if (!interaction.replied) {
      interaction.update({
        embeds: [formattedPage.embed],
        components: [formattedPage.components]
      });
      return;
    }

    command.editReply({
      embeds: [formattedPage.embed],
      components: [formattedPage.components]
    });
  });

  collector.on("end", () => {
    command.editReply({ components: [] });
    pageNumberByMember.delete(member.id);
  });
};