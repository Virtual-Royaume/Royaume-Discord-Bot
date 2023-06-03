import { describe, expect, it } from "vitest";
import { objectKeys } from "./object.util";

describe("objectKeys", () => {
  it("should return an array of object keys", () => {
    expect(objectKeys({ a: 1, b: 2, c: 3 })).toEqual(["a", "b", "c"]);
  });

  it("should return an empty array if the object has no keys", () => {
    expect(objectKeys({})).toEqual([]);
  });

  it("should return an array of object keys for nested objects", () => {
    expect(objectKeys({ a: 1, b: { c: 2, d: 3 }, e: 4 })).toEqual(["a", "b", "e"]);
  });
});