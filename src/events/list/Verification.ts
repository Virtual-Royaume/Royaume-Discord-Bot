import Event from "../Event";
import { MessageActionRow, Modal, TextInputComponent, MessageEmbed, Interaction } from "discord.js";

export default class Verification extends Event {

    public name: string = "interactionCreate";

    public async execute(interaction: Interaction) : Promise<void> {
        
        if (interaction.customId === 'verify') {
            // modal temporaire
            const modal = new Modal()
                .setCustomId('myModal')
                .setTitle('My Modal');
    
            // textinput temporaire
            const presentation = new TextInputComponent()
                .setCustomId('presentation')
                .setLabel("Présente toi au serveur !")
                .setStyle('PARAGRAPH');
    
            const firstActionRow = new MessageActionRow().addComponents(presentation);
    
            modal.addComponents(firstActionRow);
    
            await interaction.showModal(modal);
        }
    
        if (!interaction.isModalSubmit()) return;
    
        if (interaction.isModalSubmit()) {
    
            const presentation = interaction.fields.getTextInputValue('presentation');
            const logs = client.guilds.cache.get("971502491634131004").channels.cache.get("976974655623671818");
            const member = interaction.user
            const welcome = new MessageEmbed()
            const vote = new MessageEmbed()
    
            // embed temporaire
            welcome.setDescription(`Bienvenue officiellement parmis nous ${member} !\n\nLes rôles que vous voyez sur votre droite sont définis selon votre activité ainsi que l'importance que vous portez au Royaume !\n\nPour pouvoir accéder aux différents salons de la catégorie travail vous pouvez faire la commande \`-role\` dans <#736677048214618213> et choisir les rôles qui vous correspondent.`)
            welcome.setColor('PURPLE')
    
            // embed temporaire
            vote.setDescription(`**Voici la présentation de ${member} :**\n\n${presentation}`)
            vote.setColor('PURPLE')
            vote.setFooter(`Voté pour la candidature de ${member.username} ci-dessous.`)
            vote.setTimestamp()
    
            // need to make the reaction collector
            await logs.send({ embeds: [welcome, vote] }).then((msg) => {
                msg.react('✅')
                msg.react('❌')
    
                const filter = (reaction, user) => {
                    return ['✅', '❌'].includes(reaction.emoji.name) && !user.bot;
                };
    
                const collector = msg.createReactionCollector(filter, {
                    max: 1,
                    time: 15000
                });
    
                collector.on('end', (collected, reason) => {
                    // not done yet
                });
            });
    
            await interaction.reply({ content: 'Votre candidature a bien été envoyé !', ephemeral: true, })
            console.log({ presentation });
    
            try {
                member.send('Merci de votre candidature ! Elle a bien été envoyé aux membres du serveur ! Une réponse vous sera donné sous peu.')
            } catch (err) {
                return;
            }
    
        }
    }
}