import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { Stopwatch } from "./stopwatch.model";

@Component({
  selector: "app-stopwatch",
  templateUrl: "./stopwatch.component.html",
  styleUrls: ["./stopwatch.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StopwatchComponent {
  @Input({ required: true }) stopwatch: Stopwatch | undefined = undefined;
}
