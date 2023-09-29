import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";
import { Stopwatch } from "./stopwatch.model";

@Component({
  selector: "app-stopwatch",
  templateUrl: "./stopwatch.component.html",
  styleUrls: ["./stopwatch.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StopwatchComponent {
  @Input({ required: true }) stopwatch: Stopwatch | undefined = undefined;

  @Output() remove = new EventEmitter<string>();
  @Output() stop = new EventEmitter<string>();
  @Output() pause = new EventEmitter<string>();
  @Output() resume = new EventEmitter<string>();

  onRemove() {
    console.log("remove");
  }

  onStop() {
    console.log("stop");
  }

  onPause() {
    console.log("pause");
  }

  onResume() {
    console.log("resume");
  }
}
