export default abstract class Task {

    public readonly interval: number;

    /**
     * @param interval interval in milliseconds
     */
    constructor(interval: number){
        this.interval = interval;
    }

    public abstract run(timeout: NodeJS.Timeout) : void;
}