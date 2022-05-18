import Client from "../client/Client";;
import { readdirSync } from "fs";
import path from 'path';
import Event from "./Event";
import { Collection } from "discord.js";

export default class EventManager {

    public readonly events: Collection<string, Event[]> = new Collection();
    public readonly eventListenerCount: number = 0;

    constructor(){
        const eventFiles = readdirSync(path.join(__dirname, "list"));

        eventFiles.forEach(file => {
            const event: Event = new (require(path.join(__dirname, "list", file)).default);

            this.events.set(event.name, this.events.get(event.name) ? this.events.get(event.name).concat(event) : [event]);
            Client.instance.on(event.name, async (...args) => event.run(...args));
            
            this.eventListenerCount++;
        });
    }
}