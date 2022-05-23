import Event from "../Event";
import { BaseGuildTextChannel, ButtonInteraction, GuildMember, Interaction, MessageActionRow, Modal, ModalSubmitInteraction, TextInputComponent } from "discord.js";
import { button, modal as modalIds } from "../../../resources/config/interaction-ids.json";
import { generalChannel } from "../../../resources/config/information.json";
import Client from "../../Client";
import { simpleEmbed } from "../../utils/Embed";
import { verify } from "../../../resources/config/information.json";

export default class VerifModal extends Event {

    public name: string = "interactionCreate";

    public async execute(interaction: Interaction) : Promise<void> {
        if(interaction.isButton() && interaction.customId === button.verify) this.openModal(interaction);
        if(interaction.isModalSubmit() && interaction.customId === modalIds.verify) this.submitModal(interaction);
    }

    private async openModal(interaction: ButtonInteraction) : Promise<void> {
        const modal = new Modal()
            .setCustomId(modalIds.verify)
            .setTitle("Formulaire de présentation")
            .addComponents(new MessageActionRow<TextInputComponent>().addComponents(new TextInputComponent()
                .setCustomId("presentation")
                .setLabel("Présentation :")
                .setStyle("PARAGRAPH")
                .setMinLength(50)
            ));

        await interaction.showModal(modal);
    }

    private async submitModal(interaction: ModalSubmitInteraction) : Promise<void> {
        // Get presentation :
        const presentation = interaction.fields.getTextInputValue("presentation");

        // Get general channel and member instances :
        const generalChannelInstance = await (await Client.instance.getGuild()).channels.fetch(generalChannel);
        const member = interaction.member;

        if(
            !(generalChannelInstance instanceof BaseGuildTextChannel) ||
            !(member instanceof GuildMember)
        ){
            interaction.reply({ 
                embeds: [simpleEmbed("Erreur lors de l'envoie de votre présentation, contactez un membre du serveur.", "error")],
                ephemeral: true
            });

            return;
        }

        // Send the presentation in general channel with votes :
        const message = await generalChannelInstance.send({
            embeds: [simpleEmbed(presentation, "normal", `Présentation de ${member.displayName}`).setFooter(`ID : ${member.id}`)] 
        });

        await message.react(verify.emoji.upvote);
        await message.react(verify.emoji.downvote);

        // Send confirmation reply :
        interaction.reply({ 
            embeds: [simpleEmbed("Votre présentation a été envoyé aux membres du Royaume, vous aurez une réponse d'ici peu de temps.")],
            ephemeral: true
        });
    }
}