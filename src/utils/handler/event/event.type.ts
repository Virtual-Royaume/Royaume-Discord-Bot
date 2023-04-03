import { ClientEvents } from "discord.js";

export type EventName = keyof ClientEvents;

export type EventOnce = boolean;

export type EventExecute<K extends EventName> = (...args: ClientEvents[K]) => void;