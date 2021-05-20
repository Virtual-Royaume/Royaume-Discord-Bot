import { Message } from "discord.js";

export default abstract class Command {

    private readonly name: string;
    private readonly description: string;
    private readonly category: string;
    private readonly aliases: string[];

    constructor(name: string, description: string, category: string, aliases: string[] = []){
        this.name = name;
        this.description = description;
        this.category = category;
        this.aliases = aliases;
    }

    public abstract run(args: any[], message: Message) : void;

    public getName() : string {
        return this.name;
    }

    public getCategory() : string {
        return this.category;
    }

    public getDescription() : string {
        return this.description;
    }

    public getAliases() : string[] {
        return this.aliases;
    }
}