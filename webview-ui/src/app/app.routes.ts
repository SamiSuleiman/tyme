import { Routes } from "@angular/router";
import { StopwatchesComponent } from "./stopwatches/stopwatches.component";

export const routes: Routes = [
  {
    path: "**",
    component: StopwatchesComponent,
    pathMatch: "full",
  },
];
