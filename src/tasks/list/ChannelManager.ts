import Client from "../../Client";
import Task from "../Task";
import { generalChannel } from "../../../resources/config/information.json";
import { BaseGuildTextChannel } from "discord.js";
import { simpleEmbed } from "../../utils/Embed";

const defaults = [
    "salon bleu",
    "salon rouge",
    "salon jaune"
];

const supplementaries = [
    "salon vert",
    "salon violet",
    "salon orange",
    "salon rose",
    "salon turquoise",
    "salon rose",
    "salon noir",
    "salon gris",
    "salon blanc",
    "salon brun"
];

const full = 1;

export default class ChannelManager extends Task {

    constructor() {
        super(5_000);
    }

    public async run() : Promise<void> {
        const guild = await Client.instance.getGuild();

        let countTotal = 0;

        // Ici, on récupère les salons du serveur
        for (const [id, channel] of guild.channels.cache.filter(channel => channel.type === "GUILD_VOICE")) {
            // On vérifie si c'est un salon vocal
            if (channel.type !== "GUILD_VOICE") return;

            if (defaults.includes(channel.name)) {
                // On vérifie si les salons ont des membres dedans
                if (channel.members.size >= full) {
                    countTotal++;
                }

                // On vérifie si le nombre de salons pleins est égal à la taille du tableau des salons actuels
                if (countTotal == defaults.length) {
                    if (supplementaries.length == 0) {
                        // Envoyer un message dans le salon général
                        const generalChannelInstance = await guild.channels.fetch(generalChannel);
                        if (!(generalChannelInstance instanceof BaseGuildTextChannel)) return;

                        const message = "Il n'y à plus de salons vocaux disponibles, patientez que des membres en libère un.";
                        generalChannelInstance.send({
                            embeds: [simpleEmbed(message, "normal", "Salons vocaux pleins")]
                        });
                        return;
                    }

                    // On récupère le prochain salon supplémentaire
                    const newChannel: string = supplementaries[0];

                    // On récupère le salon (de couleur) le plus bas dans le serveur
                    const lastChannel = guild.channels.cache.find(channel => channel.name == defaults[2]);

                    // On envoi le nouveau serveur dans le tableau des salons actuels
                    defaults.push(newChannel);

                    // On retire le salon supplémentaire du tableau des salons supplémentaires
                    supplementaries.shift();

                    // On crée le salon supplémentaire
                    guild.channels.create(newChannel, {
                        type: "GUILD_VOICE",
                        parent: lastChannel?.parentId,
                        position: lastChannel?.position
                    });
                }
            }
        }
    }
}