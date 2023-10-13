import { CommonModule } from "@angular/common";
import {
  CUSTOM_ELEMENTS_SCHEMA,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from "@angular/core";
import { provideVSCodeDesignSystem, vsCodeButton, vsCodeDivider } from "@vscode/webview-ui-toolkit";

provideVSCodeDesignSystem().register(vsCodeDivider, vsCodeButton);

@Component({
  selector: "app-stopwatches-actions",
  template: `
    <div>
      <section class="actions">
        <vscode-button (click)="pauseAll.emit()" appearance="secondary"> Pause All </vscode-button>
        <vscode-button (click)="resumeAll.emit()" appearance="secondary">
          Resume All
        </vscode-button>
        <vscode-button (click)="stopAll.emit()" appearance="secondary"> Stop All </vscode-button>
        <vscode-button (click)="removeAll.emit()" appearance="secondary"> Clear All </vscode-button>
      </section>
      <section class="filters"></section>
    </div>
    <vscode-divider></vscode-divider>
  `,
  styles: [
    `
      div {
        display: flex;
        gap: 1rem;
      }

      .actions {
        display: grid;
        gap: 0.5rem;
        grid-template-columns: 1fr 1fr;
      }
    `,
  ],
  imports: [CommonModule],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class StopwatchesActionsComponent {
  @Output() readonly pauseAll = new EventEmitter<void>();
  @Output() readonly resumeAll = new EventEmitter<void>();
  @Output() readonly stopAll = new EventEmitter<void>();
  @Output() readonly removeAll = new EventEmitter<void>();
}
