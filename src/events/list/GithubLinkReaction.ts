import { Message } from "discord.js";
import Event, { EventName } from "../Event";
import { githubRaw, textFetch } from "../../utils/Fetch";
import { getEnv } from "../../utils/EnvVariable";

export default class GithubLinkReaction extends Event {

    public name: EventName = "messageCreate";

    public async execute(message: Message) : Promise<void> {
        // Get urls :
        const urls = message.content.match(/http(s?):\/\/(www\.)?github.com\/([^\s]+)blob([^\s]+)#L\d+(-L\d+)?/gi);

        if (!urls) return;

        // Get codes, lines... :
        interface CodeElement {
            link: string;

            lines: number[];
            mainLine?: number;

            code: string;
            fileExtension: string;
        }

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
            const fileExtension = filePath[filePath.length - 1].match(/(?<=[.])\w*/gm)?.shift() ?? "";

            // Request for get the code :
            const requestAuth = { headers: { Authorization: `token ${getEnv<string>("GITHUB_TOKEN")}` } };
            const request = await textFetch(githubRaw + filePath.join("/"), requestAuth);

            if (request.status !== 200) return;

            const fileContent = request.body.split("\n");

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
    }
}