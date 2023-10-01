import { ChangeDetectionStrategy, Component, OnInit, inject } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { BehaviorSubject, filter, switchMap, take, tap } from "rxjs";
import { StopwatchesService } from "../../stopwatches.service";
import { AddStopwatch, Stopwatch } from "../stopwatch.model";

@Component({
  selector: "app-upsert-stopwatch",
  templateUrl: "./upsert.component.html",
  styleUrls: ["./upsert.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpsertStopwatchComponent implements OnInit {
  private readonly service = inject(StopwatchesService);

  stopwatch$ = new BehaviorSubject<Stopwatch | undefined>(undefined);

  stopwatchForm = new FormGroup({
    name: new FormControl<string>("", [Validators.required]),
    desc: new FormControl<string>("", [Validators.required]),
    elapsedInMin: new FormControl(0),
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

  onConfirm() {
    this.stopwatch$
      .pipe(
        take(1),
        filter((s): s is Stopwatch => !!s),
        switchMap((s) =>
          this.service
            .update$({
              ...s,
              name: this.stopwatchForm.value.name ?? s.name,
              desc: this.stopwatchForm.value.desc ?? s.desc,
            })
            .pipe(
              tap(() => {
                this.service.bufferStopwatch$.next(undefined);
                this.resetForm();
              })
            )
        )
      )
      .subscribe();
  }

  onCancelEdit() {
    this.service.bufferStopwatch$.next(undefined);
    this.resetForm();
  }

  onAdd() {
    this.service
      .add$(this.stopwatchForm.value as AddStopwatch)
      .pipe(tap(() => this.resetForm()))
      .subscribe();
  }

  private resetForm() {
    this.stopwatchForm.reset();
  }
}
