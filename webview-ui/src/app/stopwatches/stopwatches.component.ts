import { CommonModule } from "@angular/common";
import {
  CUSTOM_ELEMENTS_SCHEMA,
  ChangeDetectionStrategy,
  Component,
  HostListener,
  OnInit,
  inject,
} from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { provideVSCodeDesignSystem, vsCodeDivider } from "@vscode/webview-ui-toolkit";
import { EMPTY, Observable, switchMap, take } from "rxjs";
import { StopwatchListComponent } from "./stopwatch-list.component";
import { Stopwatch } from "./stopwatch.model";
import { StopwatchStatusService } from "./stopwatch/stopwatch-status.service";
import { UpsertStopwatchComponent } from "./stopwatch/stopwatch-upsert.component";
import { StopwatchesActionsComponent } from "./stopwatches-actions.component";
import { StopwatchesStatsComponent } from "./stopwatches-stats.component";
import { StopwatchesService } from "./stopwatches.service";

provideVSCodeDesignSystem().register(vsCodeDivider);

@Component({
  template: `<div class="container">
    <div class="left">
      <app-upsert-stopwatch></app-upsert-stopwatch>
    </div>
    <div class="right" *ngIf="{ stopwatches: stopwatches$ | async } as value">
      <div class="stopwatches__stats">
        <app-stopwatches-stats [stopwatches]="value.stopwatches ?? []"></app-stopwatches-stats>
      </div>
      <div class="stopwatches__actions">
        <app-stopwatches-actions
          (stopAll)="onStopAll()"
          (resumeAll)="onResumeAll()"
          (pauseAll)="onPauseAll()"
          (removeAll)="onRemoveAll()"
        ></app-stopwatches-actions>
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
    StopwatchesActionsComponent,
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
  private readonly swService = inject(StopwatchesService);
  private readonly swStatusService = inject(StopwatchStatusService);

  stopwatches$: Observable<Stopwatch[]> = EMPTY;

  ngOnInit() {
    this.stopwatches$ = this.swService.stopwatches$;
  }

  onClickGet() {
    this.swService.get$().subscribe();
  }

  @HostListener("window:keydown.alt.backspace")
  onRemoveAll() {
    this.swService.remove$().subscribe();
  }

  @HostListener("window:keydown.alt.p")
  onPauseAll() {
    this.stopwatches$
      .pipe(
        take(1),
        switchMap((s) =>
          this.swService.update$(
            this.swStatusService.pause(
              s.filter((toPause) => !toPause.isPaused && !toPause.isStopped)
            )
          )
        )
      )
      .subscribe();
  }

  @HostListener("window:keydown.alt.s")
  onStopAll() {
    this.stopwatches$
      .pipe(
        take(1),
        switchMap((s) =>
          this.swService.update$(this.swStatusService.stop(s.filter((toStop) => !toStop.isStopped)))
        )
      )
      .subscribe();
  }

  @HostListener("window:keydown.alt.r")
  onResumeAll() {
    this.stopwatches$
      .pipe(
        take(1),
        switchMap((s) =>
          this.swService.update$(
            this.swStatusService.resume(s.filter((toResume) => toResume.isPaused))
          )
        )
      )
      .subscribe();
  }
}
