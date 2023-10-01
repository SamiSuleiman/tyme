import { Injectable } from "@angular/core";
import * as _ from "lodash";
import { DateTime } from "luxon";
import { Stopwatch } from "./stopwatch.model";

@Injectable()
export class StopwatchStatusService {
  /**
   * @param stopwatches ***running*** stopwatches to pause.
   * @returns the same stopwatches in the correct state
   */
  pause(stopwatches: Stopwatch[]) {
    return _.cloneDeep(stopwatches.filter((s) => !s.isPaused && !s.isStopped)).map((stopwatch) => {
      let newElapsed = DateTime.now().diff(stopwatch.start);
      if (stopwatch.elapsed) {
        newElapsed = newElapsed.plus(stopwatch.elapsed);
      }
      stopwatch.elapsed = newElapsed;
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
        stopwatch.start = DateTime.now();
      }
      stopwatch.isStopped = true;
      stopwatch.stop = DateTime.now();
      return stopwatch;
    });
  }

  /**
   * @param stopwatches ***paused*** stopwatches to resume.
   * @returns the same stopwatches in the correct state.
   */
  resume(stopwatches: Stopwatch[]) {
    return _.cloneDeep(stopwatches.filter((s) => s.isPaused)).map((stopwatch) => {
      stopwatch.start = DateTime.now();
      stopwatch.isPaused = false;
      return stopwatch;
    });
  }
}
