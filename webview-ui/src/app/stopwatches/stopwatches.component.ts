import { CommonModule } from "@angular/common";
import {
  CUSTOM_ELEMENTS_SCHEMA,
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { EMPTY, Observable } from "rxjs";
import { StopwatchListComponent } from "./stopwatch-list.component";
import { Stopwatch } from "./stopwatch.model";
import { UpsertStopwatchComponent } from "./stopwatch/stopwatch-upsert.component";
import { StopwatchesStatsComponent } from "./stopwatches-stats.component";
import { StopwatchesService } from "./stopwatches.service";

@Component({
  template: `<div class="container">
    <div class="left">
      <app-upsert-stopwatch></app-upsert-stopwatch>
    </div>
    <div class="right" *ngIf="{ stopwatches: stopwatches$ | async } as value">
      <div class="stopwatches__stats">
        <app-stopwatches-stats [stopwatches]="value.stopwatches ?? []"></app-stopwatches-stats>
      </div>
      <div
        class="stopwatches__list"
        *ngIf="value.stopwatches && value.stopwatches?.length; else empty"
      >
        <app-stopwatch-list [stopwatches]="value.stopwatches"></app-stopwatch-list>
      </div>
      <ng-template #empty>
        <h3>empty</h3>
      </ng-template>
    </div>
  </div> `,
  styles: [
    `
      :host {
        width: 100%;
      }

      .container {
        display: grid;
        grid-template-columns: 0.25fr 0.4fr;
        gap: 6rem;
      }

      .right,
      .stopwatches__list {
        display: flex;
      }

      .right {
        flex-direction: column;
      }

      .stopwatches__list {
        word-break: break-all;
        max-height: 80vh;
        overflow: scroll;
      }
    `,
  ],
  imports: [
    StopwatchesStatsComponent,
    CommonModule,
    ReactiveFormsModule,
    StopwatchListComponent,
    UpsertStopwatchComponent,
  ],
  selector: "app-stopwatches",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class StopwatchesComponent implements OnInit {
  private readonly service = inject(StopwatchesService);

  stopwatches$: Observable<Stopwatch[]> = EMPTY;

  ngOnInit() {
    this.stopwatches$ = this.service.stopwatches$;
  }

  onClickGet() {
    this.service.get$().subscribe();
  }
}
