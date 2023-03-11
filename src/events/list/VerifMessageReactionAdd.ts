import { GuildMember, Message, MessageReaction } from "discord.js";
import Client from "$core/Client";
import Event, { EventName } from "$core/events/Event";
import { verify } from "$resources/config/information.json";
import { gameGuildId } from "$resources/config/information.json";
import { simpleEmbed } from "$core/utils/Embed";
import { msg } from "$core/utils/Message";
import Logger from "$core/utils/Logger";

export default class VerifMessageReactionAdd extends Event {

  public readonly enabledInDev = false;

  public name: EventName = "messageReactionAdd";

  public async execute(messageReaction: MessageReaction): Promise<void> {
    if (messageReaction.message.guildId === gameGuildId) return;

    // Check if the embed are a "presentation" message :
    const embed = (await messageReaction.fetch()).message.embeds[0];

    if (embed?.title?.split(" ")[0] !== "Présentation") return;

    // Get the presentation member instance :
    let member: GuildMember;

    try {
      member = await (await Client.instance.getGuild()).members.fetch(embed.footer?.text.replace("ID : ", "") ?? "");
    } catch {
      return;
    }

    if (!(member instanceof GuildMember)) return;

    // Check if the member is accepted :
    const removeReactions = (): Promise<Message<boolean>> => messageReaction.message.reactions.removeAll();

    if (
      messageReaction.emoji.name === verify.emoji.upVote
            && messageReaction.count - 1 >= verify.reactionNeededCount.upVote
    ) {
      try {
        await member.roles.add(verify.roles.verified);
        await member.roles.remove(verify.roles.waiting);
      } catch (e) {
        Logger.error(`Error while updating member ${member?.user.id} roles : ${e}`);
      }

      const embed = simpleEmbed(msg("event-verifmessagereactionadd-exec-embed-member-accepted", []));

      messageReaction.message.reply({ content: msg("event-verifmessagereactionadd-exec-welcome-message", [member.id]), embeds: [embed] });

      removeReactions();
    }

    // Check if the member is rejected :
    if (
      messageReaction.emoji.name === verify.emoji.downVote
            && messageReaction.count - 1 >= verify.reactionNeededCount.downVote
    ) {
      // Reject the member :
      await messageReaction.message.reply({
        embeds: [simpleEmbed(
          msg(
            "event-verifmessagereactionadd-exec-embed-member-rejected",
            [member.displayName]
          ),
          "error"
        )]
      });

      await member.send({ embeds: [simpleEmbed(msg("event-verifmessagereactionadd-exec-embed-member-rejected-mp"), "error")] });

      member.kick();

      removeReactions();
    }
  }

}