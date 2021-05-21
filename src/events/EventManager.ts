import Client from "../client/Client";;

import { readdir } from "fs";
import path from 'path';
import Event from "./Event";

export default class EventManager {

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
                } catch (e) {
                }
            })
        })
    }
}