import { Pipe, PipeTransform, inject } from "@angular/core";
import { DateTime, Duration } from "luxon";
import { Observable, map, startWith, timer } from "rxjs";
import { Memo, MemoStats } from "./stopwatch.model";
import { StopwatchStatusService } from "./stopwatch/stopwatch-status.service";

@Pipe({
  name: "stopwatchesStats",
  standalone: true,
})
export class StopwatchesStatsPipe implements PipeTransform {
  private readonly stopwatchService = inject(StopwatchStatusService);

  transform(stopwatches: Memo[]): Observable<MemoStats> {
    return timer(10, Duration.fromObject({ minutes: 1 }).toMillis()).pipe(
      startWith([]),
      map(() => ({
        runningCount: stopwatches.filter((s) => !s.isPaused && !s.isStopped).length,
        pausedCount: stopwatches.filter((s) => s.isPaused).length,
        stoppedCount: stopwatches.filter((s) => s.isStopped).length,
        totalCount: stopwatches.length,
        totalElapsed: this.totalElapsed(stopwatches),
        elapsedToday: this.totalElapsed(
          stopwatches.filter(
            (s) => DateTime.fromISO(s.createdAt).startOf("day") >= DateTime.now().startOf("day")
          )
        ),
      }))
    );
  }

  private totalElapsed(stopwatches: Memo[]) {
    return this.stopwatchService.formatDuration(
      stopwatches
        .map((s) => this.stopwatchService.getElapsed(s).raw)
        .reduce((a, b) => a.plus(b), Duration.fromObject({ minute: 0 }))
    );
  }
}
