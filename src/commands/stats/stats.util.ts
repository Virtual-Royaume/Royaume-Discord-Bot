import type { GraphType } from "./stats.type";
import type { GetServerActivityHistoryQuery } from "#/utils/request/graphql";
import type { ChartConfiguration } from "chart.js";
import { global } from "#/configs/global";
import { dayJS } from "#/configs/day-js";
import { dateFormat } from "#/utils/function/date";

export const generateChartConfig = (
  type: GraphType,
  serverActivity: GetServerActivityHistoryQuery["serverActivity"],
  darkMode = false
): ChartConfiguration => {
  return {
    type: "line",
    data: {
      labels: serverActivity.map(element => {
        return dateFormat(dayJS(element.date).tz());
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