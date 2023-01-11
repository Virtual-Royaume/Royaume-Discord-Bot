import Client from "$core/Client";
import { readdirSync } from "node:fs";
import Event from "$core/events/Event";
import Logger from "$core/utils/Logger";
import { isDevEnvironment } from "$core/utils/Environment";

export default class EventManager {

  constructor() {
    this.load();
  }

  private async load() : Promise<void> {
    const files = readdirSync(`${__dirname}/list`).filter(file => file.endsWith(".ts") || file.endsWith(".js"));

    let i = 0;
    for (const file of files) {
      const dynamicImport = await import(`./list/${file}`);
      const event: Event = new dynamicImport.default();

      if (!event.enabledInDev && isDevEnvironment) continue;
      Client.instance[event.once ? "once" : "on"](event.name, (...args) => event.execute(...args));
      i++;
    }

    Logger.info(`${i} events loaded`);
  }

}