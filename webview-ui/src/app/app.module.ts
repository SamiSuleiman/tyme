import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { StopwatchesModule } from "./stopwatches/stopwatches.module";

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, StopwatchesModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
