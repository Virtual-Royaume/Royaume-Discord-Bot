import Client from "../client/Client";
import { readdirSync } from "fs";
import path from 'path';
import Event from "./Event";
import { Collection } from "discord.js";

export default class EventManager {

    public readonly events: Collection<string, Event[]> = new Collection();
    public readonly eventListenerCount: number = 0;

    constructor(){
        const eventFiles = readdirSync(path.join(__dirname, "list"));

        this.eventListenerCount = eventFiles.length

        eventFiles.forEach(file => {
            // We use require here for a dynamic import.
                // eslint-disable-next-line @typescript-eslint/no-var-requires 
            const event: Event = new (require(path.join(__dirname, "list", file)).default);
            
            const getEvents = this.events.get(event.name)
            this.events.set(event.name, getEvents ? getEvents.concat(event) : [event]);
            Client.instance.on(event.name, async (...args) => event.run(...args));
        });
    }
}
