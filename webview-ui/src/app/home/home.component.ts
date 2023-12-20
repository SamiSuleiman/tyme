import { AsyncPipe } from "@angular/common";
import {
  CUSTOM_ELEMENTS_SCHEMA,
  ChangeDetectionStrategy,
  Component,
  HostListener,
  OnInit,
  inject,
} from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatSidenavModule } from "@angular/material/sidenav";
import { provideVSCodeDesignSystem, vsCodeProgressRing } from "@vscode/webview-ui-toolkit";
import { Observable, Subject, switchMap, take, tap } from "rxjs";
import { PrefsComponent } from "../prefs/prefs.component";
import { PrefsService } from "../prefs/prefs.service";
import { StopwatchListComponent } from "../stopwatches/stopwatch-list.component";
import { Stopwatch, StopwatchFilter } from "../stopwatches/stopwatch.model";
import { StopwatchStatusService } from "../stopwatches/stopwatch/stopwatch-status.service";
import { UpsertStopwatchComponent } from "../stopwatches/stopwatch/stopwatch-upsert.component";
import { StopwatchesActionsComponent } from "../stopwatches/stopwatches-actions.component";
import { StopwatchesStatsComponent } from "../stopwatches/stopwatches-stats.component";
import { StopwatchesService } from "../stopwatches/stopwatches.service";

provideVSCodeDesignSystem().register(vsCodeProgressRing);

@Component({
  template: `
    <div class="container">
      @if(prefs$ | async; as prefs) {
      <mat-drawer-container [hasBackdrop]="false">
        <mat-drawer #drawer mode="side" opened>
          <div class="left">
            <app-upsert-stopwatch></app-upsert-stopwatch>
          </div>
        </mat-drawer>
        <mat-drawer-content>
          <vscode-button appearance="icon" (click)="drawer.toggle()">
            @if(drawer.opened){
            <span class="icon"><i [class]="'codicon codicon-chevron-left'"></i></span>
            } @else{
            <span class="icon"><i [class]="'codicon codicon-chevron-right'"></i></span>
            }
          </vscode-button>
          <vscode-button appearance="icon" (click)="onOpenPrefs()">
            <span class="icon"><i [class]="'codicon codicon-settings'"></i></span>
          </vscode-button>

          @if ({ stopwatches: filteredStopwatches$ | async }; as value) {
          <div>
            @if(prefs.showStats){
            <div>
              <app-stopwatches-stats
                [stopwatches]="value.stopwatches ?? []"
              ></app-stopwatches-stats>
            </div>
            } @if(prefs.showBulkActions){
            <div>
              <app-stopwatches-actions
                [prefs]="prefs"
                (stopAll)="onStopAll()"
                (resumeAll)="onResumeAll()"
                (pauseAll)="onPauseAll()"
                (removeAll)="onRemoveAll()"
                (filterChange)="onFilterChange($event)"
              ></app-stopwatches-actions>
            </div>
            } @if (value.stopwatches && value.stopwatches.length) {
            <div class="stopwatches__list">
              <app-stopwatch-list
                [prefs]="prefs"
                [stopwatches]="value.stopwatches"
              ></app-stopwatch-list>
            </div>
            } @else {
            <h3>empty</h3>
            }
          </div>
          }
        </mat-drawer-content>
      </mat-drawer-container>
      } @else {
      <vscode-progress-ring></vscode-progress-ring>
      }
    </div>
  `,
  styles: [
    `
      :host,
      mat-drawer-container,
      app-stopwatch-list {
        width: 100%;
        height: 100%;
      }

      mat-drawer-content,
      mat-drawer {
        background-color: var(--background);
        color: var(--foreground);
      }

      mat-drawer {
        padding: 10px;
        width: 30%;
      }

      mat-drawer-content > * {
        margin: 10px;
      }

      .stopwatches__list {
        word-break: break-all;
        max-height: 80vh;
        overflow: scroll;
      }

      .container {
        display: flex;
        height: 100%;
        width: 100%;
        align-items: center;
        justify-content: center;
      }
    `,
  ],
  imports: [
    MatDialogModule,
    MatSidenavModule,
    StopwatchesStatsComponent,
    StopwatchesActionsComponent,
    ReactiveFormsModule,
    StopwatchListComponent,
    UpsertStopwatchComponent,
    AsyncPipe,
  ],
  selector: "app-home",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomeComponent implements OnInit {
  private readonly swService = inject(StopwatchesService);
  private readonly swStatusService = inject(StopwatchStatusService);
  private readonly dialog = inject(MatDialog);

  private readonly _stopwatches$: Observable<Stopwatch[]> = this.swService.stopwatches$;

  prefs$ = inject(PrefsService).prefs$;
  filteredStopwatches$ = new Subject<Stopwatch[]>();

  filterChange$ = new Subject<StopwatchFilter>();

  ngOnInit(): void {
    this.filterChange$
      .pipe(
        switchMap((filter) =>
          this.swService.get$().pipe(
            switchMap(() =>
              this._stopwatches$.pipe(
                tap((stopwatches) => {
                  const filtered = stopwatches.filter(
                    (sw) =>
                      (filter.paused && sw.isPaused) ||
                      (filter.stopped && sw.isStopped) ||
                      (filter.running && !sw.isStopped && !sw.isPaused)
                  );
                  this.filteredStopwatches$.next(filtered);
                })
              )
            )
          )
        )
      )
      .subscribe();
  }

  onOpenPrefs(): void {
    this.dialog.open(PrefsComponent, {
      width: "800px",
      // height: "400px",
      disableClose: true,
    });
  }

  onFilterChange(filter: StopwatchFilter): void {
    this.filterChange$.next(filter);
  }

  @HostListener("window:keydown.alt.backspace")
  onRemoveAll(): void {
    this.swService.remove$().subscribe();
  }

  @HostListener("window:keydown.alt.p")
  onPauseAll(): void {
    this._stopwatches$
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
  onStopAll(): void {
    this._stopwatches$
      .pipe(
        take(1),
        switchMap((s) =>
          this.swService.update$(this.swStatusService.stop(s.filter((toStop) => !toStop.isStopped)))
        )
      )
      .subscribe();
  }

  @HostListener("window:keydown.alt.r")
  onResumeAll(): void {
    this._stopwatches$
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
