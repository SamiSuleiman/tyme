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
import { AddStopwatch, Elapsed, Stopwatch } from "../stopwatch.model";
import { StopwatchesService } from "../stopwatches.service";

provideVSCodeDesignSystem().register(allComponents);

@Component({
  template: `
    <form
      class="row"
      [formGroup]="stopwatchForm"
      *ngIf="{ value: stopwatch$ | async } as stopwatch"
    >
      <app-text-field
        placeholder="short and simple name."
        label="name"
        size="50"
        formControlName="name"
        icon="tasklist"
      ></app-text-field>
      <app-text-area
        placeholder="describe the entry."
        label="description"
        formControlName="desc"
      ></app-text-area>
      <app-text-field
        [disabled]="!!stopwatch.value"
        label="offset in minutes"
        size="50"
        formControlName="elapsedInMin"
        icon="watch"
        type="number"
      ></app-text-field>

      <vscode-button
        *ngIf="!stopwatch.value; else confirm"
        (click)="onConfirm()"
        appearance="icon"
        [disabled]="stopwatchForm.invalid"
      >
        <span class="icon"><i class="codicon codicon-add"></i></span>
      </vscode-button>
      <ng-template #confirm>
        <div class="edit-actions">
          <vscode-button (click)="onConfirm()" appearance="icon" [disabled]="stopwatchForm.invalid">
            <span class="icon"><i class="codicon codicon-check"></i></span>
          </vscode-button>
          <vscode-button (click)="onCancelEdit()" appearance="icon">
            <span class="icon"><i class="codicon codicon-discard"></i></span>
          </vscode-button>
        </div>
      </ng-template>
    </form>
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

  elapsedPattern = new RegExp(/\b\d+[smhdwy]\b/gm);

  stopwatch$ = new BehaviorSubject<Stopwatch | undefined>(undefined);

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
              elapsedInMin: 0,
            } as AddStopwatch);
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

  //validate string format e.x: 1h 2m 6y
  private parseElapsed(elapsed: string) {
    return elapsed
      .split(" ")
      .filter((candidate) => this.elapsedPattern.test(candidate))
      .map((elapsed) => {
        return {
          unit: elapsed.match(/\D/gm)?.[0] ?? "m",
          duration: parseInt(elapsed.match(/\d/gm)?.[0] ?? "") ?? 0,
        } as Elapsed;
      })
      .reduce((_, b) => {
        return Duration.fromObject({
          ["seconds"]: b.duration,
        });
      }, Duration.fromMillis(0));
  }
}
