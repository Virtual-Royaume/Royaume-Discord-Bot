import { Message, TextChannel } from "discord.js";
import { JSDOM } from "jsdom";
import Command from "../../Command";
import Client from "../../../client/Client";

export default class Help extends Command {

    constructor(){
        super(
            "citates",
            "Permet d'afficher une citation",
            "utils",
            {
                aliases: ["citation", "cita"]
            }
        );
    }

    async run(args: any[], message: Message) : Promise<void> {
        let citation;
        
        switch(args[0]) {
            case "about":
                args.shift();
                
                citation = this.getCitateAbout(args.join("-"))
            break;

            case "from":
                args.shift();

                citation = this.getCitateFrom(args.join("-"))
            break;

            case undefined:
                Client.instance.embed.sendSimple("Aucune citation trouvée.", message.channel);
            return;

            default:
                citation = await this.getCitateAbout(args.join("-"))
            break;
        }

        if(citation){
            citation = this.unpackCitate(await citation);

            if(citation){
                Client.instance.embed.sendSimple(
                    "**\"** *" + citation[0] + '* **\"**\n\n__' + citation[1] + "__", 
                    <TextChannel>message.channel
                );

                return;
            }
        }
        
        Client.instance.embed.sendSimple("Aucune citation trouvée.", message.channel);
    }

    private unpackCitate(div: Element) : [string, string] | undefined {
        let citation = div.querySelector("div.laCitation p.laCitation q a")?.textContent;
        let author = div.querySelector("div.auteur a")?.getAttribute("title");

        if(author && citation) return [citation, author];
    }

    private async getCitateAbout(key: string) : Promise<Element> {
        const result = (await JSDOM.fromURL("https://citation-celebre.leparisien.fr/citation/" + key)).window.document;
        const citations = result.getElementsByClassName("citation");

        return citations[Math.floor(Math.random() * citations.length)];
    }

    private async getCitateFrom(key: string) : Promise<Element> {
        const result = (await JSDOM.fromURL("https://citation-celebre.leparisien.fr/auteur/" + key)).window.document;
        const citations = result.getElementsByClassName("citation");

        return citations[Math.floor(Math.random() * citations.length)];
    }
}