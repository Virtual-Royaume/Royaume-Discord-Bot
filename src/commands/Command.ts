import { Message } from "discord.js";

export default abstract class Command {

    public readonly name: string;
    public readonly description: string;
    public readonly category: string;
    public readonly aliases: string[];
    public readonly usage: string;

    constructor(name: string, description: string, category: string, aliases: string[] = [], usage: string = ''){
        this.name = name;
        this.description = description;
        this.category = category;
        this.aliases = aliases;
        this.usage = usage;
    }

    public abstract run(args: any[], message: Message) : void;
}