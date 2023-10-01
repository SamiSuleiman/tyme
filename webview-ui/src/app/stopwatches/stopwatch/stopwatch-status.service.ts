import { Injectable } from "@angular/core";
import * as _ from "lodash";
import { DateTime, Duration } from "luxon";
import { Stopwatch } from "./stopwatch.model";

@Injectable()
export class StopwatchStatusService {
  /**
   * @param stopwatches ***running*** stopwatches to pause.
   * @returns the same stopwatches in the correct state
   */
  pause(stopwatches: Stopwatch[]) {
    return _.cloneDeep(stopwatches.filter((s) => !s.isPaused && !s.isStopped)).map((stopwatch) => {
      let newElapsed = DateTime.now().diff(DateTime.fromISO(stopwatch.start));
      if (stopwatch.elapsed) {
        newElapsed = newElapsed.plus(Duration.fromISO(stopwatch.elapsed));
      }
      stopwatch.elapsed = newElapsed.toString() ?? "";
      stopwatch.isPaused = true;
      stopwatch.pauses++;
      return stopwatch;
    });
  }

  /**
   * @param stopwatches ***running or paused*** stopwatches to stop.
   * @returns the same stopwatches in the correct state.
   * @description stopped stopwatches can't be resumed.
   */
  stop(stopwatches: Stopwatch[]) {
    return _.cloneDeep(stopwatches.filter((s) => !s.isStopped)).map((stopwatch) => {
      if (stopwatch.isPaused) {
        stopwatch.isPaused = false;
        stopwatch.start = DateTime.now().toString();
      }
      stopwatch.isStopped = true;
      stopwatch.stop = DateTime.now().toString();
      return stopwatch;
    });
  }

  /**
   * @param stopwatches ***paused*** stopwatches to resume.
   * @returns the same stopwatches in the correct state.
   */
  resume(stopwatches: Stopwatch[]) {
    return _.cloneDeep(stopwatches.filter((s) => s.isPaused)).map((stopwatch) => {
      stopwatch.start = DateTime.now().toString();
      stopwatch.isPaused = false;
      return stopwatch;
    });
  }
}
