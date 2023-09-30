import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { UiModule } from "../ui/ui.module";
import { StopwatchListComponent } from "./stopwatch-list/stopwatch-list.component";
import { StopwatchComponent } from "./stopwatch/stopwatch.component";
import { UpsertStopwatchComponent } from "./stopwatch/upsert/upsert.component";
import { StopwatchesComponent } from "./stopwatches.component";
import { StopwatchesService } from "./stopwatches.service";
import { StopwatchStatusPipe } from './stopwatch/stopwatch-status.pipe';

@NgModule({
  declarations: [
    StopwatchesComponent,
    StopwatchComponent,
    UpsertStopwatchComponent,
    StopwatchListComponent,
    StopwatchStatusPipe,
  ],
  imports: [CommonModule, ReactiveFormsModule, UiModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [StopwatchesService],
})
export class StopwatchesModule {}
