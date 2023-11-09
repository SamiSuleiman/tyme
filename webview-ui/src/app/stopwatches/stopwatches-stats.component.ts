import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { provideVSCodeDesignSystem, vsCodeDivider, vsCodeTag } from "@vscode/webview-ui-toolkit";
import { Stopwatch } from "./stopwatch.model";
import { StopwatchesStatsPipe } from "./stopwatches-stats.pipe";

provideVSCodeDesignSystem().register(vsCodeTag, vsCodeDivider);

@Component({
  template: `
    @if (stopwatches | stopwatchesStats | async; as stats) {
    <div>
      <section class="counters">
        <vscode-tag>running: {{ stats.runningCount }}</vscode-tag>
        <vscode-tag>paused: {{ stats.pausedCount }}</vscode-tag>
        <vscode-tag>stopped: {{ stats.stoppedCount }}</vscode-tag>
        <vscode-tag>total: {{ stats.totalCount }}</vscode-tag>
      </section>
      <section>
        <vscode-tag>today's elapsed time: {{ stats.elapsedToday }}</vscode-tag>
        <vscode-tag>total elapsed time: {{ stats.totalElapsed }}</vscode-tag>
      </section>
      <vscode-divider></vscode-divider>
    </div>
    }
  `,
  styles: [
    `
      div {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      section {
        vscode-tag:last-of-type {
          margin-inline-start: auto;
        }
      }

      .stats,
      section {
        display: flex;
        gap: 0.5rem;
      }

      .stats {
        flex-direction: column;
      }
    `,
  ],
  imports: [CommonModule, StopwatchesStatsPipe],
  selector: "app-stopwatches-stats",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class StopwatchesStatsComponent {
  @Input({ required: true }) stopwatches: Stopwatch[] = [];
}
