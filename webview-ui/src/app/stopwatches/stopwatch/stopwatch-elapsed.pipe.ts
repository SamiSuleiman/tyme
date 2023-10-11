import { Pipe, PipeTransform, inject } from "@angular/core";
import { Duration } from "luxon";
import { interval, map, startWith } from "rxjs";
import { Stopwatch } from "../stopwatch.model";
import { StopwatchService } from "./stopwatch.service";

@Pipe({
  name: "stopwatchElapsed",
  standalone: true,
})
export class StopwatchElapsedPipe implements PipeTransform {
  private readonly stopwatchService = inject(StopwatchService);

  transform(value: Stopwatch, ...args: unknown[]) {
    return interval(Duration.fromObject({ seconds: 1 }).toMillis()).pipe(
      startWith("just started, good luck."),
      map(() => this.stopwatchService.getElapsed(value))
    );
  }
}
