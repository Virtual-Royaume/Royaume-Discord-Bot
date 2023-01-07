import { readdirSync } from "fs";
import Logger from "$core/utils/Logger";
import { isDevEnvironment } from "$core/utils/Environment";
import Task from "./Task";

export default class TaskManager {

  public async load() : Promise<void> {
    const files = readdirSync(`${__dirname}/list`).filter(file => file.endsWith(".ts") || file.endsWith(".js"));

    let i = 0;
    for (const file of files) {
      const dynamicImport = await import(`./list/${file}`);

      const task: Task = new dynamicImport.default();
      if (!task.enabledInDev && isDevEnvironment) task.stop();
      else i++;
    }

    Logger.info(`${i} tasks loaded`);
  }

}