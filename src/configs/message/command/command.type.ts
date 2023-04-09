import { BaseMessage } from "../message.type";

export type Command = Base & {
  groups?: Record<string, SubCommandGroup>;
  subcmds?: Record<string, SubCommand>;
  options?: Record<string, Base>;
  exec?: Record<string, BaseMessage>;
};

export type SubCommandGroup = Base & {
  subcmds: Record<string, SubCommand>;
}

export type SubCommand = Base & {
  options?: Record<string, Base>;
}

export type Base = {
  name: string;
  description: string;
}