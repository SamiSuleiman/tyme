import { Pipe, PipeTransform } from "@angular/core";
import { Memo } from "../stopwatch.model";

@Pipe({
  name: "stopwatchStatus",
  standalone: true,
})
export class StopwatchStatusPipe implements PipeTransform {
  transform(value: Memo, ...args: unknown[]): unknown {
    return value.isPaused ? "paused" : value.isStopped ? "stopped" : "running";
  }
}
