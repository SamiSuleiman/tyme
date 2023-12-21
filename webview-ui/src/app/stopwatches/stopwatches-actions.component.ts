import {
  CUSTOM_ELEMENTS_SCHEMA,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  inject,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { provideVSCodeDesignSystem, vsCodeButton, vsCodeDivider } from "@vscode/webview-ui-toolkit";
import { switchMap, tap } from "rxjs";
import { PrefsService } from "../prefs/prefs.service";
import { CheckboxComponent } from "../ui/components/checkbox.component";
import { StopwatchFilter } from "./stopwatch.model";

provideVSCodeDesignSystem().register(vsCodeDivider, vsCodeButton);

@Component({
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
      <section class="filters">
        <div>
          <form [formGroup]="filterGroup">
            <app-checkbox
              label="Running"
              formControlName="running"
              [checked]="getControlVal('running')"
            >
            </app-checkbox>
            <app-checkbox
              label="Paused"
              formControlName="paused"
              [checked]="getControlVal('paused')"
            >
            </app-checkbox>
            <app-checkbox
              label="Stopped"
              formControlName="stopped"
              [checked]="getControlVal('stopped')"
            >
            </app-checkbox>
          </form>
        </div>
      </section>
    </div>
    <vscode-divider></vscode-divider>
  `,
  styles: [
    `
      div {
        display: flex;
        gap: 1rem;
        justify-content: space-between;
        align-items: center;
      }

      vscode-button {
        margin: 3px;
      }
    `,
  ],
  imports: [ReactiveFormsModule, CheckboxComponent],
  selector: "app-stopwatches-actions",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class StopwatchesActionsComponent {
  @Output() readonly pauseAll = new EventEmitter<void>();
  @Output() readonly resumeAll = new EventEmitter<void>();
  @Output() readonly stopAll = new EventEmitter<void>();
  @Output() readonly removeAll = new EventEmitter<void>();
  @Output() readonly filterChange = new EventEmitter<any>();

  prefs$ = inject(PrefsService).prefs$;

  readonly filterGroup = new FormGroup({
    running: new FormControl(false),
    paused: new FormControl(false),
    stopped: new FormControl(false),
  });

  constructor() {
    this.prefs$
      .pipe(
        tap((prefs) => this.filterGroup.setValue(prefs.filter)),
        switchMap(() =>
          this.filterGroup.valueChanges.pipe(
            tap((valChanges) => this.filterChange.emit(valChanges as StopwatchFilter))
          )
        ),
        takeUntilDestroyed()
      )
      .subscribe();
  }

  getControlVal(key: string): boolean {
    return this.filterGroup.get(key)?.value;
  }
}
