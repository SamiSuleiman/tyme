import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { UiModule } from "../ui/ui.module";
import { StopwatchListComponent } from "./stopwatch-list/stopwatch-list.component";
import { StopwatchStatusPipe } from "./stopwatch/stopwatch-status.pipe";
import { StopwatchComponent } from "./stopwatch/stopwatch.component";
import { StopwatchStatusService } from "./stopwatch/stopwatch.service";
import { UpsertStopwatchComponent } from "./stopwatch/upsert/upsert.component";
import { StopwatchesComponent } from "./stopwatches.component";
import { StopwatchesService } from "./stopwatches.service";

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
  providers: [StopwatchesService, StopwatchStatusService],
})
export class StopwatchesModule {}
