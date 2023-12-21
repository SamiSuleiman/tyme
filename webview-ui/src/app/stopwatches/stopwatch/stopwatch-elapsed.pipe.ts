import { Pipe, PipeTransform, inject } from "@angular/core";
import { Duration } from "luxon";
import { Observable, map, startWith, timer } from "rxjs";
import { Stopwatch } from "../stopwatch.model";
import { StopwatchStatusService } from "./stopwatch-status.service";

@Pipe({
  name: "stopwatchElapsed",
  standalone: true,
})
export class StopwatchElapsedPipe implements PipeTransform {
  private readonly stopwatchService = inject(StopwatchStatusService);

  transform(value: Stopwatch): Observable<{
    raw: Duration;
    formatted: string;
  }> {
    return timer(10, Duration.fromObject({ minutes: 1 }).toMillis()).pipe(
      startWith(""),
      map(() => this.stopwatchService.getElapsed(value))
    );
  }
}
