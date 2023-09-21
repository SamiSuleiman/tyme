import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { Stopwatch } from "../stopwatch/stopwatch.model";

@Component({
  selector: "app-stopwatch-list",
  templateUrl: "./stopwatch-list.component.html",
  styleUrls: ["./stopwatch-list.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StopwatchListComponent {
  @Input() stopwatches: Stopwatch[] = [];
}
