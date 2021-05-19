import Client from "../Client";
import { Message } from "discord.js";

export default class CommandMap {
    
    constructor(){
        /*fs.readdirSync(__dirname + "/events/").forEach(fileName => {
            require("./events/" + fileName);
            
            console.log(prefix + "Event " + fileName + " chargé");
        });*/

        Client.instance.on("message", (msg: Message) => {
            console.log(msg.content);
        });
    }
}