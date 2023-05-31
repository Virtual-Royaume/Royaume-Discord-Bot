import type { ServerActivity } from "#/utils/request/graphql";

export type GraphType = {
  columnName: keyof Omit<ServerActivity, "date" | "__typename">;
  description: string;
}