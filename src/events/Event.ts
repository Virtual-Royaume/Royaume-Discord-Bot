export default abstract class Event {

    constructor(public name: string){}

    public abstract run(...args: any[]) : void;
}