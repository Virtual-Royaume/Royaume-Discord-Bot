import type { ServerActivity } from "$core/utils/request/graphql/graphql";

export type GraphType = {
  columnName: keyof Omit<ServerActivity, "date" | "__typename">;
  description: string;
}