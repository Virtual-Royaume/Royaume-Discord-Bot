import type { MaybePromise } from "$core/utils/typing/promise";
import type { ClientEvents } from "discord.js";

export type EventName = keyof ClientEvents;

export type EventOnce = boolean;

export type EventExecute<K extends EventName> = (...args: ClientEvents[K]) => MaybePromise<void>;