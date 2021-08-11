import { readdirSync } from "fs";
import path from "path";
import Task from "./Task";

export default class TaskManager {

    public readonly tasks: Task[] = [];
    public taskListenerCount = 0;

    constructor(){
        readdirSync(path.join(__dirname, "list")).forEach(file => {
            // We use require here for a dynamic import.
            // eslint-disable-next-line @typescript-eslint/no-var-requires 
            const task: Task = new (require(path.join(__dirname, "list", file)).default);
        
            const interval: NodeJS.Timeout = setInterval(async () => task.run(interval), task.interval);

            this.taskListenerCount++;
            this.tasks.push(task);
        });
    }
}