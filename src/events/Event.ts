export default abstract class Event {

    public abstract readonly name: string;
    public readonly once: boolean = false;

    public abstract execute(...args: any[]) : void;
}