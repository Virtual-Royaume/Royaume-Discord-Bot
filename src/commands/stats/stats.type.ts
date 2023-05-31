import type { ServerActivity } from "$core/utils/request/graphql/code-gen/graphql";

export type GraphType = {
  columnName: keyof Omit<ServerActivity, "date" | "__typename">;
  description: string;
}