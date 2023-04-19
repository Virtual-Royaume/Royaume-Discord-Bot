import type { CodeElement } from "./github-link-reaction.type";
import { githubPermalinkRegex, githubRawUrl } from "./github-link-reaction.const";
import { getStringEnv } from "$core/utils/env-variable";
import type { EventExecute, EventName } from "$core/utils/handler/event";
import { restTextRequest } from "$core/utils/request/request";
import { logger } from "$core/utils/logger";
import { userWithId } from "$core/utils/user";

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
        authorization: `token ${getStringEnv("GITHUB_TOKEN")}`
      }
    });

    if (!response.success) return;

    const fileContent = response.data.split("\n");

    // Check if the line number is not too high :
    if (linesNumber[1] > fileContent.length) {
      linesNumber[0] = fileContent.length - 10;
      linesNumber[1] = fileContent.length;
    }

    // Format selected code :
    let selectedCode = "";

    for (let i = linesNumber[0]; i <= linesNumber[1]; i++) {
      selectedCode += `${mainLine === i ? ">" + i : " " + i} ${fileContent[i - 1]}\n`;
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
    message.suppressEmbeds(true);

    // Send code messages :
    for (const element of codeElements) {
      const codeBlock = `\`\`\`${element.fileExtension}\n${element.code}\n\`\`\``;
      const lines = element.mainLine ? `Ligne ${element.mainLine}` : `Lignes ${element.lines.join("-")}`;

      message.reply({
        content: `> ${lines} de \`${element.link}\`\n${codeBlock}`,
        allowedMentions: {
          repliedUser: false
        }
      });
    }
  }

  logger.info(`We replied to a GitHub link sent by ${userWithId(message.author)}`);
};