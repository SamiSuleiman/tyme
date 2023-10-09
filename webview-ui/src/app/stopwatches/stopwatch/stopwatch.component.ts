import { CommonModule } from "@angular/common";
import {
  CUSTOM_ELEMENTS_SCHEMA,
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
} from "@angular/core";
import { provideVSCodeDesignSystem, vsCodeTag } from "@vscode/webview-ui-toolkit";
import { concat } from "rxjs";
import { StopwatchesService } from "../stopwatches.service";
import { StopwatchElapsedPipe } from "./stopwatch-elapsed.pipe";
import { StopwatchStatusPipe } from "./stopwatch-status.pipe";
import { StopwatchStatusService } from "./stopwatch-status.service";
import { Stopwatch } from "./stopwatch.model";

provideVSCodeDesignSystem().register(vsCodeTag);

@Component({
  template: `
    <div class="container" *ngIf="stopwatch">
      <div class="row">
        <div class="actions">
          <vscode-button appearance="icon" (click)="onRemove()">
            <span class="icon"><i class="codicon codicon-remove"></i></span>
          </vscode-button>
          <vscode-button appearance="icon" (click)="onEdit()">
            <span class="icon"><i class="codicon codicon-edit"></i></span>
          </vscode-button>
        </div>
        <h3>
          {{
            stopwatch.name.length > 27 ? (stopwatch.name | slice: 0 : 24) + "..." : stopwatch.name
          }}
        </h3>
        <div class="actions">
          <vscode-tag>{{ stopwatch | stopwatchStatus }}</vscode-tag>
          <vscode-button *ngIf="!stopwatch?.isStopped" appearance="icon" (click)="onStop()">
            <span class="icon"><i class="codicon codicon-stop-circle"></i></span>
          </vscode-button>
          <vscode-button
            appearance="icon"
            *ngIf="!stopwatch?.isPaused && !stopwatch?.isStopped"
            (click)="onPause()"
          >
            <span class="icon"><i class="codicon codicon-debug-pause"></i></span>
          </vscode-button>
          <vscode-button
            appearance="secondary"
            *ngIf="stopwatch?.isPaused && !stopwatch?.isStopped"
            (click)="onResume()"
          >
            <span class="icon"><i class="codicon codicon-play-circle"></i></span>
          </vscode-button>
        </div>
      </div>
      <i>elapsed: {{ stopwatch | stopwatchElapsed | async }}</i>
      <div class="row">
        <h4>{{ stopwatch.desc }}</h4>
      </div>
      <div class="row">
        <i>created at: {{ stopwatch.createdAt }}</i>
      </div>
    </div>
  `,
  styles: [
    `
      .container {
        display: flex;
        flex-direction: column;
        margin-block-end: 3rem;
      }

      .container > .row:first-child {
        justify-content: space-between;
      }

      vscode-button {
        margin-inline: 0.3rem;
        width: 42px;
        height: 27px;
      }

      .actions {
        display: flex;
        align-items: center;
      }
    `,
  ],
  imports: [StopwatchStatusPipe, StopwatchElapsedPipe, CommonModule],
  selector: "app-stopwatch",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class StopwatchComponent {
  private readonly service = inject(StopwatchesService);
  private readonly statusService = inject(StopwatchStatusService);

  @Input({ required: true }) stopwatch: Stopwatch | undefined = undefined;

  onEdit() {
    if (!this.stopwatch) return;
    this.service.bufferStopwatch$.next(this.stopwatch);
  }

  onRemove() {
    if (!this.stopwatch) return;
    this.service.remove$(this.stopwatch?.id).subscribe();
  }

  onStop() {
    if (!this.stopwatch) return;
    concat(
      ...this.statusService.stop([this.stopwatch]).map((stopped) => this.service.update$(stopped))
    ).subscribe();
  }

  onPause() {
    if (!this.stopwatch) return;
    concat(
      ...this.statusService.pause([this.stopwatch]).map((paused) => this.service.update$(paused))
    ).subscribe();
  }

  onResume() {
    if (!this.stopwatch) return;
    concat(
      ...this.statusService
        .resume([this.stopwatch])
        .map((stopwatch) => this.service.update$(stopwatch))
    ).subscribe();
  }
}
