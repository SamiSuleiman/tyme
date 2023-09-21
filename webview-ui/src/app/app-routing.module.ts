import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { StopwatchesComponent } from "./stopwatches/stopwatches.component";

const routes: Routes = [{ path: "**", component: StopwatchesComponent }];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
