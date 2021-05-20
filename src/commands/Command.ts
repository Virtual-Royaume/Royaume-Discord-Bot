import { Message } from "discord.js";

export default abstract class Command {

    public name: string;
    public description: string;
    public category: string;

    constructor(name: string, description: string, category: string){
        this.name = name;
        this.description = description;
        this.category = category;
    }

    public abstract run(args: any[], message: Message) : void;
}