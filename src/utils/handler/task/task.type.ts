import type { MaybePromise } from "$core/utils/typing/promise";

export type TaskInterval = string;

export type TaskExecute = () => MaybePromise<void>;