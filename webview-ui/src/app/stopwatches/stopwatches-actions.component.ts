import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectionStrategy, Component } from "@angular/core";
import { provideVSCodeDesignSystem, vsCodeDivider } from "@vscode/webview-ui-toolkit";

provideVSCodeDesignSystem().register(vsCodeDivider);

@Component({
  selector: "app-stopwatches-actions",
  template: `
    <div>
      <vscode-divider></vscode-divider>
    </div>
  `,
  styles: [],
  imports: [CommonModule],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class StopwatchesActionsComponent {}
