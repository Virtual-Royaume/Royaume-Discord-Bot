import type { EventExecute, EventName } from "$core/utils/handler/event";
import type { GuildMember, Message } from "discord.js";
import { proposals } from "$core/configs/global";
import { guilds } from "$core/configs/guild";
import { events } from "$core/configs/message/event";
import { simpleEmbed } from "$core/utils/discord/embed";
import { logger } from "$core/utils/logger";
import { msgParams } from "$core/utils/message";

export const event: EventName = "messageReactionAdd";

export const execute: EventExecute<"messageReactionAdd"> = async(messageReaction) => {
  if (messageReaction.message.guild?.id !== guilds.pro.guildId) return;

  // Check if the embed are a "presentation" message :
  const embed = (await messageReaction.fetch()).message.embeds[0];

  if (embed?.title?.split(" ")[0] !== "Présentation") return;

  // Get the presentation member instance :
  let member: GuildMember;

  try {
    member = await messageReaction.message.guild.members.fetch(embed.footer?.text.replace("ID : ", "") ?? "");
  } catch {
    return;
  }

  // Check if the member is accepted :
  const removeReactions = (): Promise<Message<boolean>> => messageReaction.message.reactions.removeAll();

  if (
    messageReaction.emoji.name === proposals.verify.upVote.emoji
    && (messageReaction.count ?? 0) > proposals.verify.upVote.count
  ) {
    try {
      await member.roles.add(guilds.pro.roles.verified);
      await member.roles.remove(guilds.pro.roles.waiting);

      logger.info(`Member ${member?.user.id} has been accepted in the guild.`);
    } catch (e) {
      logger.error(`Error while updating member ${member?.user.id} roles : ${String(e)}`);
    }

    const embed = simpleEmbed(events.verifMessageReactionAdd.accepted);

    void messageReaction.message.reply({ content: msgParams(events.verifMessageReactionAdd.welcome, [member.id]), embeds: [embed] });

    void removeReactions();
  }

  // Check if the member is rejected :
  if (
    messageReaction.emoji.name === proposals.verify.downVote.emoji
    && (messageReaction.count ?? 0) > proposals.verify.downVote.count
  ) {
    await messageReaction.message.reply({
      embeds: [simpleEmbed(
        msgParams(
          events.verifMessageReactionAdd.rejected,
          [member.displayName]
        ),
        "error"
      )]
    });

    await member.send({ embeds: [simpleEmbed(events.verifMessageReactionAdd.rejectedMp, "error")] });

    void member.kick();

    logger.info(`Member ${member?.user.id} has been rejected from the guild.`);
    void removeReactions();
  }
};