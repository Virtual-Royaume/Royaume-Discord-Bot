import type { CommandExecute } from "#/utils/handler/command";
import type { GraphType } from "./stats.type";
import { getServerActivityHistory } from "#/api/requests/server-activity";
import { generateChartConfig } from "./stats.util";
import { global } from "#/configs/global";
import { commands } from "#/configs/message/command";
import { simpleEmbed } from "#/utils/discord/embed";
import { msgParams } from "#/utils/message";
import { gqlRequest } from "#/utils/request";
import { ChartJSNodeCanvas } from "chartjs-node-canvas";
import { AttachmentBuilder, EmbedBuilder } from "discord.js";
import { logger } from "#/utils/logger";
import { userWithId } from "#/utils/discord/user";

export const execute: CommandExecute = async(command) => {
  // Get server activity :
  const serverActivityQuery = await gqlRequest(getServerActivityHistory, {
    historyCount: command.options.getNumber(commands.stats.options.history.name) ?? 30
  });

  if (!serverActivityQuery.ok) {
    void command.reply({
      embeds: [simpleEmbed(commands.stats.exec.historyQueryError, "error")],
      ephemeral: true
    });
    return;
  }

  const serverActivity = serverActivityQuery.value.serverActivity.reverse();

  // Start defering response
  await command.deferReply();

  const types: GraphType[] = [
    { columnName: "voiceMinute", description: commands.stats.exec.voices },
    { columnName: "messageCount", description: commands.stats.exec.messages },
    { columnName: "memberCount", description: commands.stats.exec.members }
  ];

  // Generate and send charts :
  const embeds: EmbedBuilder[] = [];
  const files: AttachmentBuilder[] = [];

  for (const type of types) {
    const config = generateChartConfig(type, serverActivity, command.options.getBoolean(commands.stats.options.darkMode.name) ?? false);

    embeds.push(new EmbedBuilder()
      .setTitle(type.description)
      .setColor(global.colors.primary)
      .setImage(`attachment://${String(type.columnName)}-chart.png`));

    const chart = new ChartJSNodeCanvas({ height: 500, width: 1100 });

    files.push(new AttachmentBuilder(
      chart.renderToBufferSync(config),
      { name: `${String(type.columnName)}-chart.png` }
    ));
  }

  logger.info(`Stats command executed by ${userWithId(command.user)} with ${serverActivity.length} server activity entries`);
  void command.editReply({ content: msgParams(commands.stats.exec.title, [serverActivity.length]), embeds, files });
};