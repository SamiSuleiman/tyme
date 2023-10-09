import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { StopwatchComponent } from "./stopwatch/stopwatch.component";
import { Stopwatch } from "./stopwatch/stopwatch.model";

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
  @Input() stopwatches: Stopwatch[] = [];
}
