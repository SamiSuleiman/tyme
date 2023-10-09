import { CommonModule } from "@angular/common";
import {
  CUSTOM_ELEMENTS_SCHEMA,
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { EMPTY, Observable } from "rxjs";
import { TextAreaComponent } from "../ui/text-area.component";
import { TextFieldComponent } from "../ui/text-field.component";
import { StopwatchListComponent } from "./stopwatch-list.component";
import { UpsertStopwatchComponent } from "./stopwatch/stopwatch-upsert.component";
import { Stopwatch } from "./stopwatch/stopwatch.model";
import { StopwatchesService } from "./stopwatches.service";

@Component({
  template: `<div class="container">
    <div class="left">
      <app-upsert-stopwatch></app-upsert-stopwatch>
    </div>
    <div class="right">
      <app-stopwatch-list
        *ngIf="stopwatches$ | async as stopwatches"
        [stopwatches]="stopwatches"
      ></app-stopwatch-list>
    </div>
  </div> `,
  styles: [
    `
      :host {
        width: 100%;
      }

      .container {
        display: grid;
        grid-template-columns: 0.25fr 0.5fr;
        gap: 3rem;
      }

      .right {
        word-break: break-all;
      }
    `,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TextAreaComponent,
    TextFieldComponent,
    StopwatchListComponent,
    UpsertStopwatchComponent,
  ],
  selector: "app-stopwatches",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class StopwatchesComponent implements OnInit {
  private readonly service = inject(StopwatchesService);

  stopwatches$: Observable<Stopwatch[]> = EMPTY;

  ngOnInit() {
    this.stopwatches$ = this.service.stopwatches$;
  }

  onClickGet() {
    this.service.get$().subscribe();
  }
}
