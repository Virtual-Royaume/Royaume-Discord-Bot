import type { CodeElement } from "./github-link-reaction.type";
import type { EventExecute, EventName } from "#/utils/handler/event";
import { githubPermalinkRegex, githubRawUrl } from "./github-link-reaction.const";
import { env } from "#/configs/env";
import { restTextRequest } from "#/utils/request";
import { logger } from "#/utils/logger";
import { userWithId } from "#/utils/discord/user";

export const event: EventName = "messageCreate";

export const execute: EventExecute<"messageCreate"> = async(message) => {
  const urls = message.content.match(githubPermalinkRegex);

  if (!urls) return;

  const codeElements: CodeElement[] = [];

  for (const url of urls) {
    // Get lines :
    const linesNumber = [...url.matchAll(/L\d+/gi)].map(number => Number(number[0].slice(1)));

    let mainLine: number | null = null;

    if (linesNumber.length > 2) {
      return;
    } else if (linesNumber.length === 2 && linesNumber[1] - linesNumber[0] > 10) {
      linesNumber[1] = linesNumber[0] + 10;
    } else if (linesNumber.length === 1) {
      mainLine = linesNumber[0];

      linesNumber[0] = linesNumber[0] - 5;
      if (linesNumber[0] < 0) linesNumber[0] = 1;

      linesNumber.push(linesNumber[0] + 10);
    }

    // Remove `https://www.github.com/` and line identification from link :
    const filePath = url.replace(/^(http(s?):\/\/(www\.)?github.com\/)|(#L\d*)(-L\d*)?$/ig, "").split("/");

    // Remove "blob" from link :
    filePath.splice(2, 1);

    // Get file extension for code highlight :
    const fileExtension = filePath[filePath.length - 1].match(/(?<=[.])\w*/gm)?.pop() ?? "";

    // Request for get the code :
    const response = await restTextRequest("get", githubRawUrl + filePath.join("/"), {
      headers: {
        authorization: `token ${env.GH_TOKEN}`
      }
    });

    if (!response.ok) return;

    const fileContent = response.value.split("\n");

    // Check if the line number is not too high :
    if (linesNumber[1] > fileContent.length) {
      linesNumber[0] = fileContent.length - 10;
      linesNumber[1] = fileContent.length;
    }

    // Format selected code :
    let selectedCode = "";

    for (let i = linesNumber[0]; i <= linesNumber[1]; i++) {
      selectedCode += `${mainLine === i ? `>${i}` : ` ${i}`} ${fileContent[i - 1]}\n`;
    }

    // Push informations :
    const codeElement: CodeElement = {
      link: filePath.join("/"),
      lines: linesNumber,
      code: selectedCode,
      fileExtension
    };

    if (mainLine) codeElement.mainLine = mainLine;

    codeElements.push(codeElement);
  }

  if (codeElements.length) {
    // Remove link integration :
    void message.suppressEmbeds(true);

    // Send code messages :
    for (const element of codeElements) {
      const codeBlock = `\`\`\`${element.fileExtension}\n${element.code}\n\`\`\``;
      const lines = element.mainLine ? `Ligne ${element.mainLine}` : `Lignes ${element.lines.join("-")}`;

      void message.reply({
        content: `> ${lines} de \`${element.link}\`\n${codeBlock}`,
        allowedMentions: {
          repliedUser: false
        }
      });
    }
  }

  logger.info(`We replied to a GitHub link sent by ${userWithId(message.author)}`);
};