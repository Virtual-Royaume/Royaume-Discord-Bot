import Client from "../client/Client";;

import { readdir } from "fs";
import path from 'path';
import Event from "./Event";

export default class EventManager {

    public readonly events: string[] = [];

    constructor(){
        this.loadEvents();
    }

    private loadEvents() {
        readdir(path.join(__dirname, 'list'), (err, files) => {
            files.forEach((file) => {
                delete require.cache[file];
                try {
                    const event: Event = new (require(path.join(__dirname, 'list', file)).default);
                    Client.instance.on(event.name, (...args) => event.run(...args))
                    if (!this.events.includes(event.name)) {
                        this.events.push(event.name);
                    }
                } catch (e) {
                    Client.instance.logger.error(`Error: ${e.message}`)
                }
            })
        })
    }
}