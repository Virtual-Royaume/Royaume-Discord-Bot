import { SlashCommandBuilder, SlashCommandNumberOption } from "@discordjs/builders";
import { CommandInteraction, HexColorString, MessageAttachment, MessageEmbed } from "discord.js";
import Command from "../Command";
import { ChartConfiguration } from "chart.js";
import { ChartJSNodeCanvas } from "chartjs-node-canvas";
import { request } from "../../api/Request";
import { getServerActivityHistory, GetServerActivityHistoryType } from "../../api/requests/ServerActivity";
import { ServerActivity } from "../../api/Schema";
import { colors } from "../../../resources/config/information.json";
import { dateFormat } from "../../utils/Function";
import DayJS from "../../utils/DayJS";
import { msg } from "../../utils/Message";

export default class Stats extends Command {

    public readonly slashCommand = new SlashCommandBuilder()
        .setName(msg("cmd-stats-builder-name"))
        .setDescription(msg("cmd-stats-builder-description"))
        .addNumberOption(new SlashCommandNumberOption()
            .setName(msg("cmd-stats-builder-history-name"))
            .setDescription(msg("cmd-stats-builder-history-description"))
            .setMinValue(5));

    public async execute(command: CommandInteraction) : Promise<void> {
        // Get server activity :
        const serverActivity = (await request<GetServerActivityHistoryType>(getServerActivityHistory, {
            historyCount: command.options.getNumber(msg("cmd-stats-builder-history-name")) ?? 30
        })).serverActivity.reverse();

        // Data types :
        interface Type {
            columnName: keyof Omit<ServerActivity, "date" | "__typename">;
            description: string;
        }

        const types: Type[] = [
            { columnName: "voiceMinute", description: msg("cmd-stats-exec-embed-voices") },
            { columnName: "messageCount", description: msg("cmd-stats-exec-embed-messages") },
            { columnName: "memberCount", description: msg("cmd-stats-exec-embed-members") }
        ];

        // Generate and send charts :
        const embeds: MessageEmbed[] = [];
        const files: MessageAttachment[] = [];

        types.forEach(type => {
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
            embeds.push(new MessageEmbed()
                .setTitle(type.description)
                .setColor(colors.primary as HexColorString)
                .setImage(`attachment://${type.columnName}-chart.png`));

            // Attachment :
            const chart = new ChartJSNodeCanvas({ height: 500, width: 1100 });

            chart.registerFont(`${__dirname}/../../../resources/font/poppins-regular.ttf`, { family: "Poppins" });

            files.push(new MessageAttachment(
                chart.renderToBufferSync(config),
                `${type.columnName}-chart.png`
            ));
        });

        command.reply({ content: msg("cmd-stats-exec-embed-title", [serverActivity.length]), embeds, files });
    }
}