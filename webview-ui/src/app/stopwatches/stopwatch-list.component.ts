import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { Prefs } from "../prefs/prefs.model";
import { Stopwatch } from "./stopwatch.model";
import { StopwatchComponent } from "./stopwatch/stopwatch.component";

@Component({
  template: `
    @for (stopwatch of $stopwatches(); track stopwatch) {
    <div>
      <app-stopwatch [prefs]="$prefs()" [stopwatch]="stopwatch"></app-stopwatch>
    </div>
    }
  `,
  imports: [StopwatchComponent],
  selector: "app-stopwatch-list",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StopwatchListComponent {
  $stopwatches = input.required<Stopwatch[]>({ alias: "stopwatches" });
  $prefs = input.required<Prefs>({ alias: "prefs" });
}
