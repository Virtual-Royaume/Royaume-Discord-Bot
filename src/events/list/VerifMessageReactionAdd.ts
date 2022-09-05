import { GuildMember, MessageReaction } from "discord.js";
import Client from "$core/Client";
import Event, { EventName } from "$core/events/Event";
import { verify } from "$resources/config/information.json";
import { simpleEmbed } from "$core/utils/Embed";

export default class VerifMessageReactionAdd extends Event {

    public name: EventName = "messageReactionAdd";

    public async execute(messageReaction: MessageReaction) : Promise<void> {
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
        const removeReactions = () => messageReaction.message.reactions.removeAll();

        if (
            messageReaction.emoji.name === verify.emoji.upVote
            && messageReaction.count - 1 >= verify.reactionNeededCount.upVote
        ) {
            await member.roles.add(verify.roles.verified);
            await member.roles.remove(verify.roles.waiting);

            const embed = simpleEmbed(
                "Les rôles que vous voyez sur votre droite sont définis selon votre activité au sein du Royaume !\n\n"
                + "Pour peut choisir les rôles qui convient à vos centres d'intérêt avec la commande ``/role``"
            );

            messageReaction.message.reply({ content: `Bienvenue parmis nous <@${member.id}> !`, embeds: [embed] });

            removeReactions();
        }

        // Check if the member is rejected :
        if (
            messageReaction.emoji.name === verify.emoji.downVote
            && messageReaction.count - 1 >= verify.reactionNeededCount.downVote
        ) {
            // Reject the member :
            await messageReaction.message.reply({ embeds: [simpleEmbed(`La présentation de ${member.displayName} a été refusé.`, "error")] });

            await member.send({ embeds: [simpleEmbed("Votre présentation n'a pas convaincu les membres du Royaume.", "error")] });

            member.kick();

            removeReactions();
        }
    }
}