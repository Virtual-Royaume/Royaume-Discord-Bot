import { Message as Msg } from "discord.js";
import User from "../../database/User";
import Event from "../Event";

export default class Message extends Event {

    constructor(){
        super("message");
    }

    public async run(message: Msg) : Promise<void> {
        if(message.author.bot) return;

        // Update count the number of messages sent by members :
        const user: User|undefined = await User.findOne({userId: message.author.id});

        if(user){
            const channelIds: {[key: string]: string} = {
                "786216771723198514": "general",
    
                "778044698685866025": "games",
                "829662265942343692": "musique",
    
                "798164233443213322": "dropShipping",
                "732392873667854372": "developpement",
                "779129024327712783": "trading",
                "768996501049311243": "graphisme",
                "789126328082235412": "sneakers",
            }

            if(Object.keys(channelIds).includes(message.channel.id)){
                const channelName: string = channelIds[message.channel.id];

                // @ts-ignore
                user.messageCount[channelName] = user.messageCount[channelName] + 1;
                user.save();   
            }
        } else {
            const newUser = new User();

            newUser.userId = message.author.id;
            newUser.username = message.author.username;

            newUser.messageCount = {
                general: 0,
        
                games: 0,
                musique: 0,
        
                dropShipping: 0,
                developpement: 0,
                trading: 0,
                graphisme: 0,
                sneakers: 0
            };

            newUser.save();
        }
    }
}