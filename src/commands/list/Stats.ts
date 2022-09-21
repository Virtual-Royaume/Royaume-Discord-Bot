import {
    ChatInputCommandInteraction, HexColorString, AttachmentBuilder,
    EmbedBuilder, SlashCommandBuilder, SlashCommandNumberOption
} from "discord.js";
import Command from "$core/commands/Command";
import { ChartConfiguration } from "chart.js";
import { ChartJSNodeCanvas } from "chartjs-node-canvas";
import { request } from "$core/api/Request";
import { getServerActivityHistory, GetServerActivityHistoryType } from "$core/api/requests/ServerActivity";
import { ServerActivity } from "$core/api/Schema";
import { colors } from "$resources/config/information.json";
import { dateFormat } from "$core/utils/Function";
import DayJS from "$core/utils/DayJS";

export default class Stats extends Command {

    public readonly slashCommand = new SlashCommandBuilder()
        .setName("stats")
        .setDescription("Voir les statistiques du serveurs")
        .addNumberOption(new SlashCommandNumberOption()
            .setName("historique")
            .setDescription("Nombre de jour d'historique")
            .setMinValue(5));

    public async execute(command: ChatInputCommandInteraction) : Promise<void> {
        // Get server activity :
        const serverActivity = (await request<GetServerActivityHistoryType>(getServerActivityHistory, {
            historyCount: command.options.getNumber("historique") ?? 30
        })).serverActivity.reverse();

        // Data types :
        interface Type {
            columnName: keyof Omit<ServerActivity, "date" | "__typename">;
            description: string;
        }

        const types: Type[] = [
            { columnName: "voiceMinute", description: "Temps de vocal des utilisateurs en minutes" },
            { columnName: "messageCount", description: "Nombre de messages envoyés" },
            { columnName: "memberCount", description: "Nombre de membres présents sur le serveur" }
        ];

        // Generate and send charts :
        const embeds: EmbedBuilder[] = [];
        const files: AttachmentBuilder[] = [];

        for (const type of types) {
            const config: ChartConfiguration = {
                type: "line",
                data: {
                    labels: serverActivity.map(element => {
                        return dateFormat(DayJS(element.date).tz());
                    }),
                    datasets: [{
                        label: type.description,
                        backgroundColor: colors.primary,
                        borderColor: colors.primary,
                        tension: 0.3,
                        data: serverActivity.map(element => element[type.columnName]),
                        pointRadius: serverActivity.length > 100 ? 0 : 3
                    }]
                },
                plugins: [{
                    id: "background-color",
                    beforeDraw: chart => {
                        const ctx = chart.canvas.getContext("2d");

                        if (ctx) {
                            ctx.save();

                            ctx.globalCompositeOperation = "destination-over";
                            ctx.fillStyle = "white";

                            ctx.fillRect(0, 0, chart.width, chart.height);
                            ctx.restore();
                        }
                    }
                }],
                options: {
                    plugins: {
                        legend: { labels: { font: { family: "Poppins" } } },
                        title: { font: { family: "Poppins" } },
                        tooltip: { bodyFont: { family: "Poppins" } }
                    },
                    scales: {
                        x: { ticks: { font: { family: "Poppins" } } },
                        y: { ticks: { font: { family: "Poppins" } } }
                    }
                }
            };

            // Embed :
            embeds.push(new EmbedBuilder()
                .setTitle(type.description)
                .setColor(colors.primary as HexColorString)
                .setImage(`attachment://${type.columnName}-chart.png`));

            // Attachment :
            const chart = new ChartJSNodeCanvas({ height: 500, width: 1100 });

            chart.registerFont(`${__dirname}/$resources/font/poppins-regular.ttf`, { family: "Poppins" });

            files.push(new AttachmentBuilder(
                chart.renderToBufferSync(config),
                { name: `${type.columnName}-chart.png` }
            ));
        }

        command.reply({ content: `**Statistiques sur ${serverActivity.length} jours :**`, embeds, files });
    }
}