import { GraphType } from "./stats.type";
import { global } from "$core/configs";
import DayJS from "$core/utils/day-js";
import { dateFormat } from "$core/utils/function";
import { GetServerActivityHistoryQuery } from "$core/utils/request/graphql/graphql";
import { ChartConfiguration } from "chart.js";

export const generateChartConfig = (
  type: GraphType,
  serverActivity: GetServerActivityHistoryQuery["serverActivity"],
  darkMode = false
): ChartConfiguration => {
  return {
    type: "line",
    data: {
      labels: serverActivity.map(element => {
        return dateFormat(DayJS(element.date).tz());
      }),
      datasets: [{
        label: type.description,
        backgroundColor: darkMode ? "#5555ff" : global.colors.primary,
        borderColor: darkMode ? "#5555ff" : global.colors.primary,
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
          ctx.fillStyle = darkMode ? "#2f3136" : "white";

          ctx.fillRect(0, 0, chart.width, chart.height);
          ctx.restore();
        }
      }
    }]
  };
};