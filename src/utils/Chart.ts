import chartjs from "chart.js";
import { ChartJSNodeCanvas } from "chartjs-node-canvas";
import Constants from "../constants/Constants";

export default class Chart {

    public static getBuffer(config: chartjs.ChartConfiguration, height: number, width: number) : Buffer {
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

        return config;
    }
}