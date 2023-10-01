import { ChangeDetectionStrategy, Component, Input, inject } from "@angular/core";
import { provideVSCodeDesignSystem, vsCodeTag } from "@vscode/webview-ui-toolkit";
import { concat } from "rxjs";
import { StopwatchesService } from "../stopwatches.service";
import { StopwatchStatusService } from "./stopwatch-status.service";
import { Stopwatch } from "./stopwatch.model";

provideVSCodeDesignSystem().register(vsCodeTag);

@Component({
  selector: "app-stopwatch",
  templateUrl: "./stopwatch.component.html",
  styleUrls: ["./stopwatch.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StopwatchComponent {
  private readonly service = inject(StopwatchesService);
  private readonly statusService = inject(StopwatchStatusService);

  @Input({ required: true }) stopwatch: Stopwatch | undefined = undefined;

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
