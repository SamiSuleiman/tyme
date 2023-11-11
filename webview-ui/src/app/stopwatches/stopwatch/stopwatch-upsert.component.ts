import { CommonModule } from "@angular/common";
import {
  CUSTOM_ELEMENTS_SCHEMA,
  ChangeDetectionStrategy,
  Component,
  HostListener,
  OnInit,
  inject,
} from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { allComponents, provideVSCodeDesignSystem } from "@vscode/webview-ui-toolkit";
import { Duration } from "luxon";
import { BehaviorSubject, switchMap, take, tap } from "rxjs";
import { TextAreaComponent } from "src/app/ui/components/text-area.component";
import { TextFieldComponent } from "src/app/ui/components/text-field.component";
import { AddMemo, Elapsed, Memo, TimeUnit, timeUnits } from "../stopwatch.model";
import { StopwatchesService } from "../stopwatches.service";

provideVSCodeDesignSystem().register(allComponents);

@Component({
  template: `
    @if ({ value: stopwatch$ | async }; as stopwatch) {
    <form class="row" [formGroup]="stopwatchForm">
      <app-text-field
        placeholder="Short and simple name"
        label="Name"
        size="50"
        formControlName="name"
        icon="tasklist"
      ></app-text-field>
      <app-text-area
        placeholder="Describe the entry"
        label="Description"
        formControlName="desc"
      ></app-text-area>
      <app-text-field
        [disabled]="!!stopwatch.value"
        label="Already elpased time"
        placeholder="ex.: 1w 1d 1h 30m 15s"
        size="50"
        formControlName="elapsed"
        icon="watch"
      ></app-text-field>

      @if (!stopwatch.value) {
      <vscode-button (click)="onConfirm()" appearance="icon" [disabled]="stopwatchForm.invalid">
        <span class="icon"><i class="codicon codicon-add"></i></span>
      </vscode-button>
      } @else {
      <div class="edit-actions">
        <vscode-button (click)="onConfirm()" appearance="icon" [disabled]="stopwatchForm.invalid">
          <span class="icon"><i class="codicon codicon-check"></i></span>
        </vscode-button>
        <vscode-button (click)="onCancelEdit()" appearance="icon">
          <span class="icon"><i class="codicon codicon-discard"></i></span>
        </vscode-button>
      </div>
      }
    </form>
    }
  `,
  styles: [
    `
      form {
        margin-bottom: 1.5rem;
        flex-direction: column;
      }

      form > * {
        width: 100%;
      }

      vscode-button {
        width: 100%;
      }

      .edit-actions {
        display: flex;
      }
    `,
  ],
  imports: [ReactiveFormsModule, CommonModule, TextFieldComponent, TextAreaComponent],
  selector: "app-upsert-stopwatch",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class UpsertStopwatchComponent implements OnInit {
  private readonly service = inject(StopwatchesService);

  elapsedPattern = new RegExp(/\b\d+[smhdw]\b/m);

  stopwatch$ = new BehaviorSubject<Memo | undefined>(undefined);

  stopwatchForm = new FormGroup({
    name: new FormControl<string>("", [Validators.required]),
    desc: new FormControl<string>(""),
    elapsed: new FormControl<string>(""),
  });

  ngOnInit() {
    this.service.bufferStopwatch$
      .pipe(
        tap((s) => {
          this.stopwatch$.next(s);
          if (s) {
            this.resetForm();
            this.stopwatchForm.patchValue({ name: s.name, desc: s.desc });
          }
        })
      )
      .subscribe();
  }

  @HostListener("window:keydown.alt.enter", ["$event"])
  onConfirm() {
    if (this.stopwatchForm.invalid) return;
    this.stopwatch$
      .pipe(
        take(1),
        switchMap((s) => {
          if (!s)
            return this.service.add$({
              ...this.stopwatchForm.value,
              elapsed: this.parseElapsed(this.stopwatchForm.value.elapsed ?? ""),
            } as AddMemo);
          return this.service.update$([
            {
              ...s,
              name: this.stopwatchForm.value.name ?? s.name,
              desc: this.stopwatchForm.value.desc ?? "",
            },
          ]);
        }),
        tap(() => {
          this.service.bufferStopwatch$.next(undefined);
          this.resetForm();
        })
      )
      .subscribe();
  }

  onCancelEdit() {
    this.service.bufferStopwatch$.next(undefined);
    this.resetForm();
  }

  private resetForm() {
    this.stopwatchForm.reset();
  }

  private parseElapsed(elapsed: string) {
    return elapsed
      .split(" ")
      .filter((candidate) => this.elapsedPattern.test(candidate))
      .map((elapsed) => {
        return {
          unit: elapsed.match(/\D/m)?.[0] as TimeUnit,
          duration: parseInt(elapsed.match(/\d+/m)?.[0] ?? "") ?? 0,
        } as Elapsed;
      })
      .reduce((a, b) => {
        return Duration.fromObject({ [timeUnits[b.unit]]: b.duration }).plus(a);
      }, Duration.fromMillis(0));
  }
}
