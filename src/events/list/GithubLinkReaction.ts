import { Message } from "discord.js";
import fetch from "node-fetch";
import Event from "../Event";

export default class GithubLinkReaction extends Event {

    public name: string = "messageCreate";

    private regexLinkIdentification = /http(s?):\/\/(www\.)?github.com\/([^\s]+)blob([^\s]+)#L\d*/i;
    private rawGithubDomainName = "https://raw.githubusercontent.com/";

    public async execute(message: Message) : Promise<void> {

        const url = message.content.match(this.regexLinkIdentification)?.shift();

        if(!url) return;

        const lineNum = Number(url.match(/(\d*)$/i)?.shift());
        if(Number.isNaN(lineNum)) return;

        // Remove `https://www.github.com/` and line identification from link
        let filePath = url.replace(/^(http(s?):\/\/(www\.)?github.com\/)|(#L\d*)$/ig, "").split("/");
        filePath.splice(2, 1); // Remove `blob` from link
        const fileExtension = filePath[filePath.length-1].match(/(?<=[.])\w*/gm)?.shift() ?? "";

        const fileContent = (await (await fetch(this.rawGithubDomainName + filePath.join("/"))).text()).split("\n");

        if(fileContent.shift() === '404: Not Found') return;

        let selectCode = "";
        for(let i = -5; i <= 5; i++){

            const currentLineNum = lineNum+i;

            if(fileContent[currentLineNum-1] === undefined) continue;

            const formatedLineLune = currentLineNum === lineNum ? `>${currentLineNum} ` : ` ${currentLineNum} `;

            selectCode += formatedLineLune + fileContent[currentLineNum-1] + "\n";
        }

        message.suppressEmbeds(true); // Remove link integration

        message.reply({
            content: `> Ligne ${lineNum} de \`${filePath.join("/")}\`\n\`\`\`${fileExtension}\n${selectCode}\`\`\``,
            allowedMentions: {
                repliedUser: false
            }
        });
    }
}