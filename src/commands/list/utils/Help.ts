import { Message, MessageEmbed } from "discord.js";

import Command from "../../Command";
import Client from "../../../client/Client";
import Constants from "../../../constants/Constants";

export default class Help extends Command {

    constructor() {
        super(
            "help",
            "Permet de voir la liste des commandes",
            "utils",
            {
                aliases: ["h"]
            }
        );
    }

    run(args: any[], message: Message) : void {
        const commandManager = Client.instance.commandManager;

        if(args.length === 0){
            const categories = commandManager.categories.map(category => {
                return "``" + category + "``";
            });

            const embed = new MessageEmbed();

            embed.setTitle("Liste des catégories disponibles");
            embed.setColor(Constants.color);
            embed.setDescription(
                "Pour exécuter une commande, vous devez utiliser le préfixe `" + Constants.commandPrefix + "` suivi de la commande souhaitée\n\n" +

                "Liste des catégories disponibles :\n" + 
                categories.join(", ") + "\n\n" +

                "Pour utiliser l'une des catégories citées ci-dessus, faites ``" + Constants.commandPrefix + "help [catégorie]``"
            );

            message.channel.send(embed);
        } else {
            const categoriesWithCommands = commandManager.categoriesWithCommands;

            if(!categoriesWithCommands.has(args[0])){
                Client.instance.embed.sendSimple(
                    "La catégorie `" + args[0] + "` n'existe pas !",
                    message.channel
                );

                return;
            }

            //@ts-ignore
            const commands = categoriesWithCommands.get(args[0]).map(command => {
                return "``" + Constants.commandPrefix + command.name + /*' ' + command.usage + */"``\n" +
                    command.description; // TODO : fix command.usage
            });

            const embed = new MessageEmbed();

            embed.setTitle("Commandes de la catégorie " + args[0]);
            embed.setColor(Constants.color);
            embed.setDescription(commands.slice(0, 10).join("\n\n"));

            message.channel.send(embed).then(msg => {
                const totalPage = (commands.length / 10);
                let page = 0;

                const timeout = setTimeout(() => {
                    msg.delete();
                    message.delete();
                }, 30000);

                const beforeEmoji = "◀";
                const nextEmoji = "▶";

                msg.react(beforeEmoji);
                msg.react(nextEmoji);

                // use this https://discord.js.org/#/docs/main/stable/class/ReactionCollector instead of messageReactionAdd event
                /*Client.instance.on('messageReactionAdd', (messageReaction, user) => {
                    if (user.bot) return;
                    messageReaction.users.remove(user.id);
                    timeout.refresh();

                    if (messageReaction.emoji.name === nextEmoji) {
                        if (page < totalPage) page++;
                    }
                    if (messageReaction.emoji.name === beforeEmoji) {
                        if (page > 0) page--;
                    }

                    messageReaction.message.edit(new MessageEmbed()
                        .setTitle(`Commandes de la catégorie ${args[0]}`)
                        .setColor(Constants.color)
                        .setDescription(commands.slice(0, (page + 1) * 10).join('\n\n'))
                    );
                });*/
            });
        }
    }
}