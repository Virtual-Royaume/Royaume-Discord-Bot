import { Message, MessageEmbed } from "discord.js";

import Command from "../../Command";
import Client from "../../../client/Client";
import Constants from "../../../constants/Constants";

export default class Help extends Command {

    private controlers = ["◀️", "▶️"];

    constructor() {
        super(
            "help",
            "Permet de voir la liste des commandes",
            "information",
            {
                aliases: ["h"]
            }
        );
    }

    public async run(args: any[], message: Message) : Promise<void> {
        message.channel.send(this.getHelpEmbed(args[0])).then(msg => this.helpUpdater(msg, args[0]));
    }

    private helpUpdater(message: Message, category: string|null = null){
        // Add controler reactions :
        this.controlers.forEach(emoji => message.react(emoji));

        // Create collector for updates :
        let collector = message.createReactionCollector(
            (reaction, user) => this.controlers.includes(reaction.emoji.name) && user.id !== (Client.instance.user?.id ?? ""), 
            {time: 1000 * 60 * 60 * 24} // 24 hours
        );

        collector.on("collect", (reaction, user) => {
            collector.stop();

            // Remove the reaction :
            message.reactions.resolve(reaction.emoji.name)?.users.remove(user);

            // Get the new page :
            let categories = Client.instance.commandManager.categories;
            let newCategoryIndex = category ? categories.indexOf(category) : null;
            let newCategory: string;

            if(newCategoryIndex !== null){
                newCategory = reaction.emoji.name === "◀️" ? categories[newCategoryIndex - 1] : categories[newCategoryIndex + 1];
            } else {
                newCategory = reaction.emoji.name === "◀️" ? categories[categories.length - 1] : categories[0];
            }

            // Update the message :
            message.edit(this.getHelpEmbed(newCategory)).then(msg => this.helpUpdater(msg, newCategory));
        });
    }

    private getHelpEmbed(category: string|null = null) : MessageEmbed {
        // Create base of embed :
        let embed = new MessageEmbed();

        embed.setColor(Constants.color);
        
        // Add content of the first page :
        if(!category || !Client.instance.commandManager.categories.includes(category)){
            embed.setTitle("Fonctionnement et liste des catégorie de commandes");

            embed.setDescription(
                "Pour utiliser une commande, vous devez écrire ``" + Constants.commandPrefix + "`` suivi du nom de la commande.\n\n" +

                "Pour voir les commandes disponibles, faites ``" + Constants.commandPrefix + "help <nom de la catégorie de commande>`` " +
                "ou utilisez les réactions ci-dessous.\n\n" +

                "Voici la liste des catégories de commande : ``" + Client.instance.commandManager.categories.join("``, ``") + "``."
            );
        } else {
            embed.setTitle("Catégorie " + (category.charAt(0).toUpperCase() + category.slice(1)));

            // @ts-ignore : this is checked above
            Client.instance.commandManager.categoriesWithCommands.get(category).forEach(command => {
                embed.addField(
                    "``" + Constants.commandPrefix + command.name + (command.additionalParams.aliases ? "/" + command.additionalParams.aliases.join("/") : "") +
                    (command.formattedUsage.length > 0 ? command.formattedUsage : "") + "``",

                    command.description
                );
            });
        }

        // Add the footer with current page :
        let categories = [...Client.instance.commandManager.categories];

        categories.splice(0, 0, "page d'aide");

        let categoriesFooter = categories.join(" - ");

        let replace = category !== null ? category : "page d'aide";

        embed.setFooter(categoriesFooter.replace(replace, replace.toUpperCase()));

        // Return the embed :
        return embed;
    }
}