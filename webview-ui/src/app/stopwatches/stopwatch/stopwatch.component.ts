import { ChangeDetectionStrategy, Component, Input, inject } from "@angular/core";
import { provideVSCodeDesignSystem, vsCodeTag } from "@vscode/webview-ui-toolkit";
import { StopwatchesService } from "../stopwatches.service";
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

  @Input({ required: true }) stopwatch: Stopwatch | undefined = undefined;

  onRemove() {
    if (!this.stopwatch) return;
    this.service.remove$(this.stopwatch?.id).subscribe();
  }

  onStop() {
    console.log("stop");
  }

  onPause() {
    console.log("pause");
  }

  onResume() {
    console.log("resume");
  }
}
