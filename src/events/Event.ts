import { ClientEvents } from "discord.js";

export type EventName = keyof ClientEvents;

export default abstract class Event {

    public abstract readonly name: EventName;

    public readonly once: boolean = false;

    public abstract readonly enabledInDev: boolean;

    public abstract execute(...args: unknown[]) : void;

}