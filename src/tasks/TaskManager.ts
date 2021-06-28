import { readdirSync } from "fs";
import path from "path";
import Task from "./Task";

export default class TaskManager {

    public readonly tasks: Task[] = [];
    public readonly taskListenerCount: number = 0;

    constructor(){
        readdirSync(path.join(__dirname, "list")).forEach(file => {
            const task: Task = new (require(path.join(__dirname, "list", file)).default);
        
            const interval: NodeJS.Timeout = setInterval(async () => task.run(interval), task.interval);

            // @ts-ignore : we are in the constructor
            this.taskListenerCount++;
            this.tasks.push(task);
        });
    }
}