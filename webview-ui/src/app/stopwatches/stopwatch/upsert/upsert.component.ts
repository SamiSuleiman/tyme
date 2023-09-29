import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { tap } from "rxjs";
import { StopwatchesService } from "../../stopwatches.service";
import { AddStopwatch } from "../stopwatch.model";

@Component({
  selector: "app-upsert-stopwatch",
  templateUrl: "./upsert.component.html",
  styleUrls: ["./upsert.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpsertStopwatchComponent {
  private readonly service = inject(StopwatchesService);

  stopwatchForm = new FormGroup({
    name: new FormControl<string>("", [Validators.required]),
    desc: new FormControl<string>("", [Validators.required]),
    elapsedInMin: new FormControl<number>(0),
  });

  onAdd() {
    this.service
      .add$(this.stopwatchForm.value as AddStopwatch)
      .pipe(tap(() => this.stopwatchForm.reset()))
      .subscribe();
  }

  reset() {
    this.stopwatchForm.reset();
    this.stopwatchForm.controls.name.setValue(null);
  }
}
