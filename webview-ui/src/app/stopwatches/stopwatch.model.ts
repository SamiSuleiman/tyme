import { Duration } from "luxon";

export interface Memo {
  id: string;
  name: string;
  desc?: string;
  createdAt: string;
  start: string;
  stop?: string;
  isPaused: boolean;
  isStopped: boolean;
  elapsed?: string;
  pauses: number;
}

export interface AddMemo {
  name: string;
  desc: string;
  elapsed?: Duration;
}

export interface MemoStats {
  runningCount: number;
  pausedCount: number;
  stoppedCount: number;
  totalCount: number;
  elapsedToday: string;
  totalElapsed: string;
}

export interface MemoFilter {
  running: boolean;
  paused: boolean;
  stopped: boolean;
}

export const defaultFilter: MemoFilter = {
  running: true,
  paused: true,
  stopped: true,
};

export interface Elapsed {
  unit: TimeUnit;
  duration: number;
}

//todo: find a better way to repeat the same goddamn letters in 10 places :) peace and love <3
export const timeUnits = {
  ["s"]: "seconds",
  ["m"]: "minutes",
  ["h"]: "hours",
  ["d"]: "days",
  ["w"]: "weeks",
} as const;

export type TimeUnit = "s" | "m" | "h" | "d" | "w";
