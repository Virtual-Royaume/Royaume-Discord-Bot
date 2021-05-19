import Client from "../Client";
import { Message, TextChannel } from "discord.js";

export default class CommandMap {
    
    constructor(){
        /*fs.readdirSync(__dirname + "/events/").forEach(fileName => {
            require("./events/" + fileName);
            
            console.log(prefix + "Event " + fileName + " chargé");
        });*/

        Client.instance.on("message", (msg: Message) => {
            if(msg.channel instanceof TextChannel){
                //Client.instance.sendSimpleEmbed("tgm", msg.channel);
                console.log(msg.content);
            }
        });
    }
}