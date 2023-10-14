export interface Stopwatch {
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

export interface AddStopwatch extends Partial<Stopwatch> {
  name: string;
  desc: string;
  elapsedInMin?: number;
}

export interface StopwatchStats {
  runningCount: number;
  pausedCount: number;
  stoppedCount: number;
  totalCount: number;
  elapsedToday: string;
  totalElapsed: string;
}

export interface StopwatchesFilter {
  running: boolean;
  paused: boolean;
  stopped: boolean;
}

export const defaultFilter: StopwatchesFilter = {
  running: true,
  paused: true,
  stopped: true,
};
