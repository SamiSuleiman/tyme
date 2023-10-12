import { Pipe, PipeTransform, inject } from "@angular/core";
import { Duration } from "luxon";
import { map, timer } from "rxjs";
import { Stopwatch } from "../stopwatch.model";
import { StopwatchStatusService } from "./stopwatch-status.service";

@Pipe({
  name: "stopwatchElapsed",
  standalone: true,
})
export class StopwatchElapsedPipe implements PipeTransform {
  private readonly stopwatchService = inject(StopwatchStatusService);

  transform(value: Stopwatch) {
    return timer(10, Duration.fromObject({ minutes: 1 }).toMillis()).pipe(
      map(() => this.stopwatchService.getElapsed(value))
    );
  }
}
