import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { Prefs } from "../prefs/prefs.model";
import { Stopwatch } from "./stopwatch.model";
import { StopwatchComponent } from "./stopwatch/stopwatch.component";

@Component({
  template: `
    @for (item of stopwatches; track item) {
    <div>
      <app-stopwatch [prefs]="prefs" [stopwatch]="item"></app-stopwatch>
    </div>
    }
  `,
  imports: [StopwatchComponent],
  selector: "app-stopwatch-list",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StopwatchListComponent {
  @Input({ required: true }) stopwatches: Stopwatch[] = [];
  @Input({ required: true }) prefs: Prefs;
}
