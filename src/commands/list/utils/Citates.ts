import { Message, TextChannel } from "discord.js";
import { JSDOM } from "jsdom";
import Command from "../../Command";
import Client from "../../../client/Client";

export default class Citates extends Command {

    constructor(){
        super(
            "citates",
            "Permet d'afficher une citation",
            "utils",
            {
                aliases: ["citation", "cita"],
                usage: [
                    {type: "required", usage: "\"daily\", \"from\" ou \"about\""},
                    {type: "optional", usage: "nom de l'auteur ou des mots clés"}
                ],
            }
        );
    }

    async run(args: any[], message: Message) : Promise<void> {
        if(args.length == 0){
            Client.instance.embed.sendSimple(
                this.getFormattedUsage(),
                message.channel
            );

            return;
        }

        let citation;
        
        switch(args[0]){
            case "from":
                args.shift();

                citation = await this.getCitateFrom(args.join("-"));
            break;

            case "daily":
                citation =  await this.getDailyCitate();
            break;

            case "about":
                args.shift();
            default:
                citation = await this.getCitateAbout(args.join("-"));
        }

        if(citation){
            citation = this.unpackCitate(citation);

            const text = args[0] == "daily" ? "Citation du jour": "";
            
            if(citation){
                Client.instance.embed.sendSimple(
                    text + "**\"** *" + citation.citation + '* **\"**\n\n__' + citation.author + "__",

                    <TextChannel>message.channel
                );

                return;
            }
        }
        
        Client.instance.embed.sendSimple("Aucune citation trouvée.", message.channel);
    }

    private unpackCitate(div: Element) : {citation: string, author: string} | undefined {
        let citation = div.querySelector("div.laCitation p.laCitation q a")?.textContent;
        let author = div.querySelector("div.auteur a")?.getAttribute("title");

        if(author && citation) return  {citation: citation, author: author};
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

    private async getDailyCitate() : Promise<Element> {
        const result = (await JSDOM.fromURL("https://citation-celebre.leparisien.fr/")).window.document;

        return result.getElementsByClassName("citation")[0];
    }
}