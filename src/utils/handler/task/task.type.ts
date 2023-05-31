import type { MaybePromise } from "#/utils/typing/promise";

export type TaskInterval = string;

export type TaskExecute = () => MaybePromise<void>;