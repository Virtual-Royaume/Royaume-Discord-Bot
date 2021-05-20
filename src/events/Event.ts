export default abstract class Event {

    constructor(public name: string){}

    public run(...args: any[]) : void;
}