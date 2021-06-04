import { Message, MessageEmbed } from "discord.js";
import Command from "../../Command";
import chartjs from "chart.js";
import ServerActivity from "../../../database/ServerActivity";
import Constants from "../../../constants/Constants";
import { ChartJSNodeCanvas } from "chartjs-node-canvas";

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
            {columnName: "voiceMinute", description: "Temps de vocal des utilisateurs en minute"},
            {columnName: "messageCount", description: "Nombre de message envoyé"},
            {columnName: "memberCount", description: "Nombre de membre présent sur le serveur"},
        ];

        data.forEach(type => {
            const config: chartjs.ChartConfiguration = {
                type: "line",
                data: {
                    labels: serverActivity.map(element => element.date.split("-").reverse().join("-")),
                    datasets: [{
                        label: type.description,
                        backgroundColor: Constants.color,
                        borderColor: Constants.color,
                        tension: 0.3,
                        // @ts-ignore
                        data: serverActivity.map(element => element[type.columnName])
                    }]
                },
                plugins: [{
                    id: "background-color",
                    beforeDraw: chart => {
                        const ctx = chart.canvas.getContext("2d");
    
                        if(ctx){
                            ctx.save();
                            
                            ctx.globalCompositeOperation = "destination-over";
                            ctx.fillStyle = "white";
    
                            ctx.fillRect(0, 0, chart.width, chart.height);
                            ctx.restore();   
                        }
                    }
                }]
            }

            const embed = new MessageEmbed();

            embed.setDescription("**__" + type.description + "__**");
            embed.setColor(Constants.color);
            embed.attachFiles([{
                name: type.columnName + "chart.png", 
                attachment: new ChartJSNodeCanvas({height: 500, width: 1100}).renderToBufferSync(config)
            }]);
            embed.setImage("attachment://" + type.columnName + "chart.png")

            message.channel.send(embed);
        });
    }
}