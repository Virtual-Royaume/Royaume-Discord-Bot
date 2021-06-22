import { Message, MessageEmbed } from "discord.js";
import jsdom, { JSDOM } from "jsdom"
import Command from "../../Command";
import Client from "../../../client/Client";


export default class Help extends Command {

    constructor() {
        super(
            "citates",
            "Permet d'afficher une citation.",
            "utils"
        );
    }

    async run(args: any[], message: Message) : Promise<void> {
        let citation;
        
        switch(args[0]) {
            case "about":
                args.shift()
                citation = this.get_citate_about(args.join("-"))
                break;
            case "from":
                args.shift()
                citation = this.get_citate_from(args.join("-"))
                break;
            case undefined:
                Client.instance.embed.sendSimple("Aucune citation trouvée.", message.channel);
                return;
            default:
                citation = await this.get_citate_about(args.join("-"))
                break;
        }

        if(citation){
            citation = this.unpack_citate(await citation);

            if(citation){
                Client.instance.embed.sendSimple("**\"** *" + citation[0] + '* **\"**\n\n__' + citation[1] + "__", message.channel);
                return;
            }
        }
        
        Client.instance.embed.sendSimple("Aucune citation trouvée.", message.channel);
    }

    unpack_citate(div: Element): [string, string] | undefined {
        let citation = div.querySelector('div.laCitation p.laCitation q a')?.textContent;
        let author = div.querySelector('div.auteur a')?.getAttribute('title');

        if(author && citation) return [citation, author];
    }

    async get_citate_about(key: string): Promise<Element> {
        let result = await jsdom.JSDOM.fromURL("https://citation-celebre.leparisien.fr/citation/" + key);
        let citations = result.window.document.getElementsByClassName("citation");
        return citations[Math.floor(Math.random()*citations.length)];
    }

    async get_citate_from(key: string): Promise<Element>{
        let result = await jsdom.JSDOM.fromURL("https://citation-celebre.leparisien.fr/auteur/" + key);
        let citations = result.window.document.getElementsByClassName("citation");
        return citations[Math.floor(Math.random()*citations.length)];
    }
}