import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { Stopwatch } from "./stopwatch.model";
import { StopwatchComponent } from "./stopwatch/stopwatch.component";

@Component({
  template: `
    <div *ngFor="let item of stopwatches">
      <app-stopwatch [stopwatch]="item"></app-stopwatch>
    </div>
  `,
  imports: [CommonModule, StopwatchComponent],
  selector: "app-stopwatch-list",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StopwatchListComponent {
  @Input({ required: true }) stopwatches: Stopwatch[] = [];
}
