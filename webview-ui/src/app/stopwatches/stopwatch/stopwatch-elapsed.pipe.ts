import { Pipe, PipeTransform } from "@angular/core";
import { DateTime, Duration } from "luxon";
import { interval, map, startWith } from "rxjs";
import { Stopwatch } from "./stopwatch.model";

@Pipe({
  name: "stopwatchElapsed",
})
export class StopwatchElapsedPipe implements PipeTransform {
  transform(value: Stopwatch, ...args: unknown[]) {
    return interval(Duration.fromObject({ seconds: 1 }).toMillis()).pipe(
      startWith("just started, good luck."),
      map(() => this.getElapsed(value))
    );
  }

  private getElapsed(stopwatch: Stopwatch): string {
    if (stopwatch.isStopped && stopwatch.stop) {
      let elapsed = stopwatch.stop.diff(stopwatch.start);

      if (stopwatch.elapsed) elapsed = elapsed.plus(stopwatch.elapsed);

      return this.formatDuration(elapsed);
    } else if (stopwatch.isPaused && stopwatch.elapsed) {
      return this.formatDuration(stopwatch.elapsed);
    }

    let elapsed = DateTime.now().diff(stopwatch.start);
    if (stopwatch.elapsed) elapsed = elapsed.plus(stopwatch.elapsed);
    return this.formatDuration(elapsed);
  }

  private formatDuration(duration: Duration): string {
    return duration.rescale().normalize().toHuman({ unitDisplay: "short" });
  }
}
