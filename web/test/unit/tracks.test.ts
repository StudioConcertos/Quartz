import { describe, it, expect } from "vitest";

describe("tracksDuration", () => {
  it("is zero when there are no tracks, so an unanimated slide has an inert playhead", () => {
    expect(tracksDuration(undefined)).toBe(0);
    expect(tracksDuration([])).toBe(0);
  });

  it("is the furthest key across every track, which is what makes a slide's length derived", () => {
    const tracks = [
      {
        type: "core.transform",
        path: ["position", "x"],
        keys: [
          { t: 0, value: 0 },
          { t: 800, value: 50 },
        ],
      },
      {
        type: "core.typography",
        path: ["size"],
        keys: [
          { t: 0, value: 12 },
          { t: 2000, value: 24 },
        ],
      },
    ];

    expect(tracksDuration(tracks)).toBe(2000);
  });

  it("ignores a track with no keys rather than counting it as zero-length", () => {
    const tracks = [
      { type: "core.transform", path: ["position", "x"], keys: [] },
      {
        type: "core.transform",
        path: ["position", "y"],
        keys: [{ t: 500, value: 10 }],
      },
    ];

    expect(tracksDuration(tracks)).toBe(500);
  });
});
