import { EventName, EventExecute, EventOnce } from "$core/utils/handler/event";
import { isDevEnvironment } from "$core/utils/environment";
import { EnableInDev } from "$core/utils/handler/handler.type";
import { Client } from "discord.js";
import { existsSync, readdirSync, statSync } from "fs";

export const load = async(client: Client, eventsFolder: string): Promise<number> => {
  const folders = readdirSync(eventsFolder);
  let eventsLoaded = 0;

  for (const folder of folders) {
    const path = `${eventsFolder}\\${folder}\\`;

    if (!statSync(path).isDirectory()) continue;

    const eventFileName = `${folder}.event.ts`;

    if (!existsSync(`${path}${eventFileName}`)) throw new Error(`"${eventFileName}" file can't be found in \`${path}\``);

    const dynamicEventImport = await import(`${path}${eventFileName}`);
    const enableInDev: EnableInDev = dynamicEventImport.enableInDev ?? false;

    if (!enableInDev && isDevEnvironment) continue;

    const eventName: EventName = dynamicEventImport.event;

    if (!eventName) throw new Error(`"event" isn't defined in ${path}${eventFileName}`);

    const execute: EventExecute<EventName> = dynamicEventImport.execute;

    if (!execute) throw new Error(`"execute" isn't defined in ${path}${eventFileName}`);

    const isOnce: EventOnce = dynamicEventImport.once ?? false;

    client[isOnce ? "once" : "on"](eventName, (...args) => execute(...args));

    eventsLoaded++;
  }

  return eventsLoaded;
};