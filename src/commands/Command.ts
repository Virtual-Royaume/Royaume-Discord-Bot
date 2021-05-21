import { Message } from "discord.js";

export default abstract class Command {

    public readonly name: string;
    public readonly description: string;
    public readonly category: string;
    public readonly aliases: string[];

    constructor(name: string, description: string, category: string, aliases: string[] = []){
        this.name = name;
        this.description = description;
        this.category = category;
        this.aliases = aliases;
    }

    public abstract run(args: any[], message: Message) : void;
}