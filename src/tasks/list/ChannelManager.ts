import Client from "../../Client";
import Task from "../Task";

const actually = [
    "salon bleu",
    "salon rouge",
    "salon jaune"
];

const colors = [
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

export default class ChannelManager extends Task {

    constructor() {
        super(5_000);
    }

    public async run() : Promise<void> {
        const guild = await Client.instance.getGuild();
        let colorsCount = 0;

        // Ici, on récupère les salons du serveur
        const channels = guild.channels.cache.filter(channel => channel.type === "GUILD_VOICE");

        for (const [id, channel] of channels) {
            // On filtre les salons qui sont des salons audios
            if (channel.type === "GUILD_VOICE") {
                // On récupère le nom du salon, et ont continu le code seulement si le nom est un nom de couleur
                const name = channel.name;
                // On vérifie si les salons par défaults ont 1 membres ou plus en vocal
                if (actually.includes(name)) {
                    if (channel.members.size >= 1) {
                        colorsCount++;
                        if (colorsCount === actually.length) {
                            // Ont supprime le salon de la liste "colors" et on l'ajoute dans le tableau "actually"
                            const removed = colors.shift();
                            if (!removed) {
                                console.log("Tout les salons ont déjà étés utilisées");
                                return;
                            }

                            actually.push(removed);

                            // On créer un nouveau salon avec un nom qui se trouve dans la liste des couleurs
                            // Ont récupère la valeur la première valeur de la liste "colors" et on l'ajoute dans le tableau "actually"
                            guild.channels.create(colors[0], {
                                type: "GUILD_VOICE",
                                parent: "853314658789490709",
                                position: 3
                            }).then(channel => {
                                console.log(channel.position);
                                console.log(channel.rawPosition);
                            });
                        }
                    }
                }
            }
        }

        console.log("--------------");
    }
}