import chartjs from "chart.js";
import { ChartJSNodeCanvas } from "chartjs-node-canvas";
import Constants from "../constants/Constants";

export default class Chart {

    public static getBuffer(config: chartjs.ChartConfiguration, height: number = 500, width: number = 1100) : Buffer {
        return new ChartJSNodeCanvas({height: height, width: width}).renderToBufferSync(config);
    }

    public static getDefaultConfig(type: keyof chartjs.ChartTypeRegistry, label: string, labels: string[], data: number[]) : chartjs.ChartConfiguration {
        const config: chartjs.ChartConfiguration = {
            type: type,
            data: {
                labels: labels,
                datasets: [{
                    label: label,
                    backgroundColor: Constants.color,
                    borderColor: Constants.color,
                    tension: 0.3,
                    data: data
                }]
            },
            plugins: [
                {
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
                },
                {
                    id: "signature",
                    beforeDraw: chart => {
                        const ctx = chart.canvas.getContext("2d");

                        if(ctx){
                            const signature = "royaume.world/discord";
                            const signatureSize = ctx.measureText(signature);
                            const signaturePos = {
                                x: chart.width - signatureSize.width,
                                y: 10,
                            }

                            ctx.restore();

                            ctx.font = "12px sans-serif";
                            ctx.fillStyle = "#929292";
                            ctx.textAlign = "center";
                            ctx.textBaseline = "top";

                            ctx.fillText("royaume.world/discord", signaturePos.x, signaturePos.y);

                            ctx.save();
                        }
                    }
                }
            ]
        }

        return config;
    }
}