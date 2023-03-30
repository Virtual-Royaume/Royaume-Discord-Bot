import { getServerActivityHistory } from "$core/api/requests/server-activity";
import { GraphType } from "./stats.type";
import { generateChartConfig } from "./stats.util";
import { global } from "$core/configs";
import { commands } from "$core/configs/message/command";
import { simpleEmbed } from "$core/utils/embed";
import { CommandExecute } from "$core/utils/handler/command";
import { msgParams } from "$core/utils/message";
import { gqlRequest } from "$core/utils/request";
import { isHexColor } from "$core/utils/validator";
import { ChartJSNodeCanvas } from "chartjs-node-canvas";
import { AttachmentBuilder, EmbedBuilder } from "discord.js";

export const execute: CommandExecute = async(command) => {
  // Get server activity :
  const serverActivityQuery = await gqlRequest(getServerActivityHistory, {
    historyCount: command.options.getNumber(commands.stats.options.history.name) ?? 30
  });

  if (!serverActivityQuery.success) {
    command.reply({
      embeds: [simpleEmbed(commands.stats.exec.historyQueryError, "error")],
      ephemeral: true
    });
    return;
  }

  const serverActivity = serverActivityQuery.data.serverActivity.reverse();

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

    // Embed :
    if (!isHexColor(global.colors.primary)) throw new Error("Invalid config: \"colors\" field in information.json need to be a valid hex color code");

    embeds.push(new EmbedBuilder()
      .setTitle(type.description)
      .setColor(global.colors.primary)
      .setImage(`attachment://${type.columnName}-chart.png`));

    // Attachment :
    const chart = new ChartJSNodeCanvas({ height: 500, width: 1100 });

    files.push(new AttachmentBuilder(
      chart.renderToBufferSync(config),
      { name: `${type.columnName}-chart.png` }
    ));
  }

  command.editReply({ content: msgParams(commands.stats.exec.title, [serverActivity.length]), embeds, files });
};