import { DateTime, Duration } from "luxon";

export interface Stopwatch {
  id: string;
  name: string;
  desc: string;
  createdAt: DateTime;
  start: DateTime;
  stop?: DateTime;
  isPaused: boolean;
  isStopped: boolean;
  elapsed?: Duration;
  pauses: number;
}

export interface AddStopwatch extends Partial<Stopwatch> {
  name: string;
  desc: string;
  elapsedInMin?: number;
}
