import { CommonModule } from "@angular/common";
import {
  CUSTOM_ELEMENTS_SCHEMA,
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
} from "@angular/core";
import { provideVSCodeDesignSystem, vsCodeTag } from "@vscode/webview-ui-toolkit";
import { FormattedDatePipe } from "../../ui/pipes/formatted-date.pipe";
import { Stopwatch } from "../stopwatch.model";
import { StopwatchesService } from "../stopwatches.service";
import { StopwatchElapsedPipe } from "./stopwatch-elapsed.pipe";
import { StopwatchStatusPipe } from "./stopwatch-status.pipe";
import { StopwatchStatusService } from "./stopwatch-status.service";

provideVSCodeDesignSystem().register(vsCodeTag);

@Component({
  template: `
    @if (stopwatch) {
    <div class="container">
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
            stopwatch.name.length > 21 ? (stopwatch.name | slice: 0 : 18) + "..." : stopwatch.name
          }}
        </h3>
        <div class="actions">
          <vscode-tag>{{ stopwatch | stopwatchStatus }}</vscode-tag>
          <vscode-tag>{{ stopwatch.pauses }} pauses</vscode-tag>
          @if (!stopwatch.isStopped) {
          <vscode-button appearance="icon" (click)="onStop()">
            <span class="icon"><i class="codicon codicon-stop-circle"></i></span>
          </vscode-button>
          } @if (!stopwatch.isPaused && !stopwatch.isStopped) {
          <vscode-button appearance="icon" (click)="onPause()">
            <span class="icon"><i class="codicon codicon-debug-pause"></i></span>
          </vscode-button>
          } @if (stopwatch.isPaused && !stopwatch.isStopped) {
          <vscode-button appearance="secondary" (click)="onResume()">
            <span class="icon"><i class="codicon codicon-play-circle"></i></span>
          </vscode-button>
          }
        </div>
      </div>
      <i>elapsed: {{ (stopwatch | stopwatchElapsed | async)?.formatted }}</i>
      <div class="row desc">
        <h4>{{ stopwatch.desc }}</h4>
      </div>
      <div class="row">
        <i>created at: {{ stopwatch.createdAt | formattedDate }}</i>
      </div>
    </div>
    }
  `,
  styles: [
    `
      .row.desc {
        width: 50%;
        white-space: pre-line;
      }

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
        gap: 0.5rem;
      }
    `,
  ],
  imports: [StopwatchStatusPipe, StopwatchElapsedPipe, CommonModule, FormattedDatePipe],
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
    this.service.update$(this.statusService.stop([this.stopwatch])).subscribe();
  }

  onPause() {
    if (!this.stopwatch) return;
    this.service.update$(this.statusService.pause([this.stopwatch])).subscribe();
  }

  onResume() {
    if (!this.stopwatch) return;
    this.service.update$(this.statusService.resume([this.stopwatch])).subscribe();
  }
}
