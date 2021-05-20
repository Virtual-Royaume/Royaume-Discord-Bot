import { Message } from "discord.js";

export default abstract class Command {

    public name: string;
    public description: string;
    public category: string;
    public options: object;

    constructor(name: string, description: string, category: string, options = {}){
        this.name = name;
        this.description = description;
        this.category = category;
        this.options = options;
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

    public getOptions() : object {
        return this.options;
    }
}