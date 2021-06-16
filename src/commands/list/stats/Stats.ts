import { Message, MessageEmbed } from "discord.js";
import Command from "../../Command";
import ServerActivity from "../../../database/ServerActivity";
import Constants from "../../../constants/Constants";
import { ChartJSNodeCanvas } from "chartjs-node-canvas";
import Chart from "../../../utils/Chart";

export default class Stats extends Command {

    constructor(){
        super(
            "stats",
            "Voir les statistiques du serveurs sur les 30 derniers jours",
            "statistiques"
        );
    }

    public async run(args: any[], message: Message) : Promise<void> {
        // Get server activity of the last 30 day (order by date) :
        const serverActivity = (await ServerActivity.find({
            order: {
                date: "DESC"
            },
            take: 30
        })).reverse();

        const data = [
            {columnName: "voiceMinute", description: "Temps de vocal des utilisateurs en minutes"},
            {columnName: "messageCount", description: "Nombre de messages envoyés"},
            {columnName: "memberCount", description: "Nombre de membres présents sur le serveur"},
        ];

        data.forEach(type => {
            const config = Chart.getDefaultConfig(
                "line",
                type.description,
                serverActivity.map(element => element.date.split("-").reverse().join("-")),
                // @ts-ignore
                serverActivity.map(element => element[type.columnName])
            );

            const embed = new MessageEmbed();

            embed.setDescription("**__" + type.description + "__**");
            embed.setColor(Constants.color);
            embed.attachFiles([{
                name: type.columnName + "chart.png", 
                attachment: Chart.getBuffer(config, 500, 1100)
            }]);
            embed.setImage("attachment://" + type.columnName + "chart.png")

            message.channel.send(embed);
        });
    }
}