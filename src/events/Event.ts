export default abstract class Event {

    public readonly name: string;

    constructor(name: string){
        this.name = name;
    }

    public abstract run(...args: unknown[]) : void;
}