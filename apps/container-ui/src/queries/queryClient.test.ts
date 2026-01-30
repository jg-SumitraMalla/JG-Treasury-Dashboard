import { describe, it, expect } from "vitest";
import { queryClient, queryKeys } from "./queryClient";

describe("queryClient", () => {
  it("should be defined", () => {
    expect(queryClient).toBeDefined();
  });

  it("should have default options configured", () => {
    const defaultOptions = queryClient.getDefaultOptions();
    expect(defaultOptions.queries).toBeDefined();
    expect(defaultOptions.queries?.staleTime).toBe(5 * 60 * 1000);
    expect(defaultOptions.queries?.retry).toBe(3);
  });
});

describe("queryKeys", () => {
  it("should be defined", () => {
    expect(queryKeys).toBeDefined();
  });
});

