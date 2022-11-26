import { readdirSync } from "fs";
import Logger from "$core/utils/Logger";

export default class TaskManager {

  public async load() : Promise<void> {
    const files = readdirSync(`${__dirname}/list`).filter(file => file.endsWith(".ts") || file.endsWith(".js"));

    for (const file of files) {
      const dynamicImport = await import(`./list/${file}`);

      new dynamicImport.default();
    }

    Logger.info(`${files.length} tasks loaded`);
  }
}