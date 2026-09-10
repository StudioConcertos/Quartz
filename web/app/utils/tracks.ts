import type { ComponentType } from "#shared/types";

export interface TrackKey {
  t: number;
  value: number | string;
}

export interface Track {
  type: ComponentType;
  path: string[];
  easing?: string;
  keys: TrackKey[];
}

export function tracksDuration(tracks: Track[] | undefined): number {
  let last = 0;

  for (const track of tracks ?? [])
    for (const key of track.keys) if (key.t > last) last = key.t;

  return last;
}
