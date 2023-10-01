import { describe, expect, it } from "vitest";
import { dayJS } from "#/configs/day-js";
import { getAge } from "../date.util";

describe("getAge", () => {
  it("should calculate the age correctly when the birthdate is in the past", () => {
    const birthdate = dayJS("1990-01-01");
    const currentYear = dayJS().year();

    expect(getAge(birthdate)).toBe(currentYear - birthdate.year());
  });

  it("should calculate the age correctly when the birthdate is today", () => {
    const birthdate = dayJS();

    expect(getAge(birthdate)).toBe(0);
  });

  it("should calculate the age correctly when the birthdate is in the future", () => {
    const birthdate = dayJS().add(1, "year");

    expect(getAge(birthdate)).toBe(-1);
  });
});