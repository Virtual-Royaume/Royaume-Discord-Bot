export type Method = "get" | "delete" | "post"| "put";

export type RequestParams = Omit<RequestInit, "method"> & {
  query?: Record<string, string | string[]>;
}